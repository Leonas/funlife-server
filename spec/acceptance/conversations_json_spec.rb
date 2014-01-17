require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Conversations" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:set_up_conversations) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
    @conversation1 = Factory.create(:conversation, created_by: @user1, users: [@user2])
    @conversation2 = Factory.create(:conversation, created_by: @user2, users: [@user1])
    @conversation3 = Factory.create(:conversation, created_by: @user2, users: [@user3])
    Timecop.freeze(Date.today + 1) do @conversation4  = Factory.create(:conversation, created_by: @user3, users: [@user1]) end
    @user1_message1 = Factory.create(:conversation_message, user: @user1, conversation: @conversation1, text: "message1_1")
    Timecop.freeze(Date.today + 1) do @user2_message1 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, text: "message2_1") end
    Timecop.freeze(Date.today + 2) do @user2_message2 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, text: "message2_2") end
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
            users: [
                {
                    id: @user1.id,
                    name: @user1.name,
                    avatar: @user1.avatar
                },
                {
                    id: @user2.id,
                    name: @user2.name,
                    avatar: @user2.avatar
                }
                ],
            newest_message: "message2_2",
            date:  @user2_message2.updated_at.strftime("%b %d,  %I:%M%P")
          },
          {
            id: @conversation4.id,
            users: [
                {
                    id: @user3.id,
                    name: @user3.name,
                    avatar: @user3.avatar
                },
                {
                    id: @user1.id,
                    name: @user1.name,
                    avatar: @user1.avatar
                }
                ],
            newest_message: @conversation4.conversation_messages.last.text,
            date: @conversation4.updated_at.strftime("%b %d,  %I:%M%P")
          },
          {
            id: @conversation2.id,
            users: [
                 {
                     id: @user1.id,
                     name: @user1.name,
                     avatar: @user1.avatar
                 },
                 {
                     id: @user2.id,
                     name: @user2.name,
                     avatar: @user2.avatar
                 }
                 ],
            newest_message: @conversation2.conversation_messages.last.text,
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
                                                users: [
                                                           {
                                                               id: @user1.id,
                                                               name: @user1.name,
                                                               avatar: @user1.avatar
                                                           },
                                                           {
                                                               id: @user2.id,
                                                               name: @user2.name,
                                                               avatar: @user2.avatar
                                                           }
                                                       ],

                                                conversation_messages: [
                                                    {
                                                        id:@user2_message2.id,
                                                        date: @user2_message2.updated_at.strftime("%b %d,  %I:%M%P"),
                                                        text: @user2_message2.text,
                                                        user: {
                                                            id:     @user2.id,
                                                            name:   @user2.name,
                                                            avatar: @user2.avatar,
                                                        }
                                                    },
                                                    {
                                                        id:@user2_message1.id,
                                                        date: @user2_message1.updated_at.strftime("%b %d,  %I:%M%P"),
                                                        text: @user2_message1.text,
                                                        user: {
                                                            id:     @user2.id,
                                                            name:   @user2.name,
                                                            avatar: @user2.avatar,
                                                        }
                                                    },
                                                    {
                                                        id:@user1_message1.id,
                                                        date: @user1_message1.updated_at.strftime("%b %d,  %I:%M%P"),
                                                        text: @user1_message1.text,
                                                        user: {
                                                            id:     @user1.id,
                                                            name:   @user1.name,
                                                            avatar: @user1.avatar,
                                                        }
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
    parameter :users, "user IDs", scope: :conversation, required: true, type: :array #TODO not yet implemented to use types
    parameter :text, "message",   scope: :conversation, required: true

    let(:users) { [@user2.id] }
    let(:text)  { "hello u" }
    let(:raw_post) { params.to_json }

    example_request "Create a new conversation" do
      explanation "A new conversation gets created with given user IDs and a response includes more data about the users in the conversation."
      response_body.should include_json({

            conversation: {
                id: Conversation.last.id,
                users: [
                           {
                               id: @user1.id,
                               name: @user1.name,
                               avatar: @user1.avatar
                           },
                           {
                               id: @user2.id,
                               name: @user2.name,
                               avatar: @user2.avatar
                           }
                    ],
                conversation_messages: [
                        {
                            id: Conversation.last.conversation_messages.newest.id,
                            date: Conversation.last.conversation_messages.newest.updated_at.strftime("%b %d,  %I:%M%P"),
                            text: "hello u",
                            user: {
                                id:     @user1.id,
                                name:   @user1.name,
                                avatar: @user1.avatar,
                            }
                        }
                    ]

            },

      }.to_json)


      status.should == 201
    end
  end





  ######################################
  post "/conversations/:id/create_message" do
  ######################################

    header "Authorization", :user_token
    parameter :id, "conversation id",   required: true
    parameter :text, "message",         required: true

    let(:id)       { @conversation1.id }
    let(:text)     { "wassup" }
    let(:raw_post) { params.to_json }

    example_request "Send a new message to an existing conversation" do
      explanation "A user sends a new message in a conversation and gets back the confirmed timestamp"

      response_body.should include_json({

          conversation_message:{
            id: @conversation1.conversation_messages.last.id,
            date: @conversation1.conversation_messages.last.updated_at.strftime("%b %d,  %I:%M%P"),
            text: "wassup",
            user: {
                id: @user1.id,
                name: @user1.name,
                avatar: @user1.avatar
            }
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
