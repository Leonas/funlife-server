require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Conversations" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  ######################################
  get "/conversations" do ##############
  ######################################

    let!(:set_up_conversations) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @user3 = Factory.create(:user)
      @conversation1 = Factory.create(:conversation, created_by: @user1, to_users: [@user2])
      @conversation2 = Factory.create(:conversation, created_by: @user2, to_users: [@user1])
      @conversation3 = Factory.create(:conversation, created_by: @user2, to_users: [@user3])
      Timecop.freeze(Date.today + 1) do @conversation4  = Factory.create(:conversation, created_by: @user3, to_users: [@user1]) end
      @user1_message1 = Factory.create(:conversation_message, user: @user1, conversation: @conversation1, message: "message1_1")
      Timecop.freeze(Date.today + 1) do @user2_message1 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, message: "message2_1") end
      Timecop.freeze(Date.today + 2) do @user2_message2 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, message: "message2_2") end
    end
    let!(:user_token) { token(@user1)}

    header "Authorization", :user_token

    example_request "Conversation inbox ordered by date" do
      explanation "A user's conversation inbox is returned ordered by date."
      response_body.should include_json({
        conversations: [
          {
            id: @conversation1.id,
            users: [@user2.name],
            latest_message: "message2_2",
            date:  @user2_message2.created_at.strftime("%b %d,  %I:%M%P")
          },
          {
            id: @conversation4.id,
            users: [@user3.name],
            latest_message: @conversation4.conversation_messages.last.message,
            date: @conversation4.updated_at.strftime("%b %d,  %I:%M%P")
          },
          {
            id: @conversation2.id,
            users: [@user2.name],
            latest_message: @conversation2.conversation_messages.last.message,
            date: @conversation2.updated_at.strftime("%b %d,  %I:%M%P")
          }
        ]
      }.to_json)
      status.should == 200
    end
  end

  #
  #
  #
  #######################################
  #post "/conversations" do #############
  #######################################
  #
  #  header "Authorization", token(@user1)
  #  parameter :user_ids,  "user IDs", scope: :conversations, required: true, type: :array #TODO not yet implemented to use types     #Also message can be included and diff stuff might get returned if it is?
  #  parameter :message, "message"
  #
  #  example_request "Create a new conversation" do
  #    explanation "A new conversation gets created with given user IDs and a response includes more data about the users in the conversation."
  #    response_body.should include_json({
  #
  #          conversation: {
  #              id: "2",
  #              user_ids: [3, 4, 5],
  #              names: "Jimmy, Mike, Tom"
  #          }
  #
  #    }.to_json)
  #
  #    response_body.conversation.user_ids.should_not include current_user.id
  #    response_body.conversation.names.should_not include current_user.name
  #
  #    status.should == 201
  #  end
  #end
  #
  #
  #
  #
  #######################################
  #delete "/conversations/:id" do #######
  #######################################
  #
  #  header "Authorization", token(@user1)
  #  parameter :id, "conversation id", required: true
  #
  #  example_request "Delete a conversation" do
  #    explanation "A conversation gets removed from the user's inbox"
  #    status.should == 204
  #  end
  #end
  #
  #
  #



  ######################################
  get "/conversations/:id" do ##########
  ######################################
    let!(:set_up_conversations) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @user3 = Factory.create(:user)
      @conversation1 = Factory.create(:conversation, created_by: @user1, to_users: [@user2])
      @conversation2 = Factory.create(:conversation, created_by: @user2, to_users: [@user1])
      @conversation3 = Factory.create(:conversation, created_by: @user2, to_users: [@user3])
      Timecop.freeze(Date.today + 1) do @conversation4  = Factory.create(:conversation, created_by: @user3, to_users: [@user1]) end
                                        @user1_message1 = Factory.create(:conversation_message, user: @user1, conversation: @conversation1, message: "message1_1")
      Timecop.freeze(Date.today + 1) do @user2_message1 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, message: "message2_1") end
      Timecop.freeze(Date.today + 2) do @user2_message2 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, message: "message2_2") end
    end
    let!(:user_token) { token(@user1)}
    let!(:id) { @conversation1.id}


    header "Authorization", :user_token
    parameter :id, "conversation id", required: true
    #parameter :from_timestamp, "since timestamp"   #not tested yet

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
              message: @user2_message2.message
            },
            {
                id:@user2_message1.id,
                user_id: @user2.id,
                date: @user2_message1.updated_at.strftime("%b %d,  %I:%M%P"),
                name: @user2.name,
                message: @user2_message1.message
            },
            {
                id:@user1_message1.id,
                user_id: @user1.id,
                date: @user1_message1.updated_at.strftime("%b %d,  %I:%M%P"),
                name: @user1.name,
                message: @user1_message1.message
            }
          ]
        }
      }.to_json)

      status.should == 200
    end
  end






  #######################################
  #post "/conversations/:id" do #########
  #######################################
  #
  #  header "Authorization", token(@user1)
  #  parameter :id, "conversation id", required: true
  #  parameter :message, "message",     scope: :conversation_message, required: true
  #  parameter :timestamp, "timestamp", scope: :conversation_message
  #
  #  example_request "Add a new message to an existing conversation" do
  #    explanation "huh"
  #
  #    response_body.should include_json({
  #
  #        conversation_message:{
  #          id: "1",
  #          user_id: "1",
  #          message: "Hello friend",
  #          time: "Mar 12"
  #        }
  #
  #    }.to_json)
  #
  #    status.should == 201
  #  end
  #end


end
