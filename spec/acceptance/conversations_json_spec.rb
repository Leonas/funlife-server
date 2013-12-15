require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Conversations" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:set_up_conversations) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
    @conversation1 = Factory.create(:conversation, created_by: @user1, to_users: [@user2])
    @conversation2 = Factory.create(:conversation, created_by: @user2, to_users: [@user1])
    @conversation3 = Factory.create(:conversation, created_by: @user2, to_users: [@user3])
    Timecop.freeze(Date.today + 1) do @conversation4  = Factory.create(:conversation, created_by: @user3, to_users: [@user1]) end
    @user1_message1 = Factory.create(:conversation_message, user: @user1, conversation: @conversation1, body: "message1_1")
    Timecop.freeze(Date.today + 1) do @user2_message1 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, body: "message2_1") end
    Timecop.freeze(Date.today + 2) do @user2_message2 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, body: "message2_2", created_at: 2.days.from_now) end
  end
  let!(:user_token) { generate_token(@user1)}




  ######################################
  get "/conversations" do ##############
  ######################################

    header "Authorization", :user_token

    example_request "A list of conversations in chronological order" do
      explanation "A user's conversation inbox is returned ordered by date."
      response_body.should include_json({
        conversations: [
          {
            id: @conversation1.id,
            users: [@user2.name],
            latest_message: "message2_2",
            date:  @user2_message2.updated_at.strftime("%b %d,  %I:%M%P")
          },
          {
            id: @conversation4.id,
            users: [@user3.name],
            latest_message: @conversation4.conversation_messages.last.body,
            date: @conversation4.updated_at.strftime("%b %d,  %I:%M%P")
          },
          {
            id: @conversation2.id,
            users: [@user2.name],
            latest_message: @conversation2.conversation_messages.last.body,
            date: @conversation2.updated_at.strftime("%b %d,  %I:%M%P")
          }
        ]
      }.to_json)
      status.should == 200
    end
  end





  ######################################
  get "/conversations/:id" do ##########
  ######################################


    header "Authorization", :user_token
    parameter :id, "conversation id", required: true
    #parameter :from_timestamp, "since timestamp"   #not tested yet

    let!(:id) { @conversation1.id}

    example_request "Get the messages in a conversation" do
      explanation "An array of conversation messages are returned and if a timestamp is included in the request,
                  ONLY messages from that timestamp and earlier are included."

      response_body.should include_json({

                                            conversation: {
                                                users: [@user1.name, @user2.name],

                                                conversation_messages: [
                                                    {
                                                        id:@user2_message2.id,
                                                        user_id: @user2.id,
                                                        date: @user2_message2.updated_at.strftime("%b %d,  %I:%M%P"),
                                                        name: @user2.name,
                                                        body: @user2_message2.body
                                                    },
                                                    {
                                                        id:@user2_message1.id,
                                                        user_id: @user2.id,
                                                        date: @user2_message1.updated_at.strftime("%b %d,  %I:%M%P"),
                                                        name: @user2.name,
                                                        body: @user2_message1.body
                                                    },
                                                    {
                                                        id:@user1_message1.id,
                                                        user_id: @user1.id,
                                                        date: @user1_message1.updated_at.strftime("%b %d,  %I:%M%P"),
                                                        name: @user1.name,
                                                        body: @user1_message1.body
                                                    }
                                                ]
                                            }
                                        }.to_json)

      status.should == 200
    end
  end





  ######################################
  post "/conversations" do #############
  ######################################

    header "Authorization", :user_token
    parameter :user_ids, "user IDs", scope: :conversation, required: true, type: :array #TODO not yet implemented to use types
    parameter :message, "message",   scope: :conversation, required: true

    let(:user_ids) { [@user2.id] }
    let(:message)  { "hello" }
    let(:raw_post) { params.to_json }

    example_request "Create a new conversation" do
      explanation "A new conversation gets created with given user IDs and a response includes more data about the users in the conversation."
      response_body.should include_json({

            conversation: {
                id: Conversation.last,
                users: [@user2.name],
                latest_message: "hello",
                date:  Conversation.last.updated_at.strftime("%b %d,  %I:%M%P")
            },

      }.to_json)

      conversation = JSON.parse(response_body)['conversation']
      expect(conversation['id']).to_not be_nil
      expect(conversation['date']).to_not be_nil
      expect(conversation['users']).to_not include [@user1.name]

      status.should == 201
    end
  end





  ######################################
  post "/conversations/:conversation_id/conversation_messages" do
  ######################################

    header "Authorization", :user_token
    parameter :id, "conversation id",   required: true
    parameter :message, "message",      required: true

    let(:conversation_id)      { @conversation1.id }
    let(:message) { "wassup" }
    let(:raw_post) { params.to_json }

    example_request "Send a new message to an existing conversation" do
      explanation "A user sends a new message in a conversation and gets back the confirmed timestamp"

      response_body.should include_json({

          conversation_message:{
            id: @conversation1.conversation_messages.last.id,
            user_id: @user1.id,
            date: @conversation1.conversation_messages.last.updated_at.strftime("%b %d,  %I:%M%P"),
            name: @user1.name,
            body: "wassup"
          }

      }.to_json)

      status.should == 201
    end
  end





  ######################################
  delete "/conversations/:id" do #######           #this needs to just hide it
  ######################################

    header "Authorization", :user_token
    parameter :id, "conversation id", required: true

    let!(:id) { @conversation1.id }

    example_request "Delete a conversation" do
      explanation "A conversation gets removed from the user's inbox"
      status.should == 204
    end
  end
end
