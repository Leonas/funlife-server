require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Chats" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"
  header "Authorization", :token


  ######################################
  get "/chats" do #####################
  ######################################

    let(:token) { ?? }

    example_request "Chat inbox ordered by date" do
      explanation "A user's chat inbox is returned ordered by date."
      response_body.should include_json({

          chats: [
            {
              id: "1",
              name: "First Last",
              unread: "true",
              date: "Dec 17, 11:20pm",
              photo: "photo_url"
            },
            {
                id: "1",
                name: "First Last",
                unread: "true",
                date: "Dec 17, 11:20pm",
                photo: "photo_url"
            },

      ]
      }.to_json)
      status.should == 200
    end
  end




  ######################################
  post "/chats" do ######################
  ######################################

    header "Authorization", token
    parameter :user_ids,  "user IDs", scope: :chats, required: true, type: :array #TODO not yet implemented to use types     #Also message can be included and diff stuff might get returned if it is?
    parameter :message, "message"

    example_request "Create a new chat" do
      explanation "A new chat gets created with given user IDs and a response includes more data about the users in the chat."
      response_body.should include_json({

            chat: {
                id: "2",
                user_ids: [3, 4, 5],
                names: "Jimmy, Mike, Tom"
            }

      }.to_json)

      response_body.chat.user_ids.should_not include current_user.id
      response_body.chat.names.should_not include current_user.name

      status.should == 201
    end
  end




  ######################################
  delete "/chats/:id" do ################
  ######################################

    header "Authorization", token(user1)
    parameter :id, "chat id", required: true

    example_request "Delete a chat" do
      explanation "A conversation gets removed from the user's inbox"
      status.should == 204
    end
  end






  ######################################
  get "/chats/:id" do ##################
  ######################################

    header "Authorization", token
    parameter :id, "chat id", required: true
    parameter :since_timestamp, "since timestamp"

    example_request "Get the messages in a chat" do
      explanation "An array of chat messages are returned and if a timestamp is included in the request,
                  ONLY messages from that timestamp forward are included."

      response_body.should include_json({




        chat_info: {
          participants:   "Jenny, James"
        },
        chat_messages: [
          {
            id:1,
            timestamp: 5,
            message: "Dolores blanditiis quisquam nihil excepturi sint est amet illum.",
            user_id: "3",
            img: "photo_url"
          },
          {
              id:2,
              timestamp: 4,
              message: "Dolores blanditiis quisquam nihil excepturi sint est amet illum.",
              user_id: "4",
              img: "photo_url"
          }
        ]



        }.to_json)

      status.should == 200
    end
  end






  ######################################
  post "/chats/:id" do #################
  ######################################

    header "Authorization", token
    parameter :id, "chat id", required: true
    parameter :message, "message",     scope: :chat_message, required: true
    parameter :timestamp, "timestamp", scope: :chat_message

    example_request "Add a new message to an existing chat" do
      explanation "huh"

      response_body.should include_json({

          chat_message:{
            id: "1",
            user_id: "1",
            message: "Hello friend",
            time: "Mar 12"
          }

      }.to_json)

      status.should == 201
    end
  end


end
