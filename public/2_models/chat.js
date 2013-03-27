var chat_log = {
  "chat_info": {
    "chat_id": "23213123",
    "my_photo": "photo_url_on_phone",
    "other_photo": "photo_url",
    "other_name": "Bob"
  },
  "messages": [

    {
      "id": "0",
      "user": "Bob",
      "text": "hello there",
      "time": "04:41"
    },
    {
      "id": "1",
      "user": "Sam",
      "text": "hey whats up",
      "time": "04:41"
    },
    {
      "id": "2",
      "user": "Bob",
      "text": "nothing much",
      "time": "04:41"
    },
    {
      "id": "3",
      "user": "Bob",
      "text": "what u doing",
      "time": "04:41"
    }
  ]
};
var Chat = new $.mvc.model.Extend("chat", {
  chat_id: '',
  current_chat: this,                                        //might be wrong
  my_photo: function () {
    return current_user.profile_pic;                          //this might keep getting executed multiple times
  },
  latest_sent_message_timestamp: '',
  latest_received_message_timestamp: '',
  messages: [],
  poll_for_messages: function () {
    var data = {
      chat_id: this.chat_id,
      timestamp: this.latest_received_message_timestamp,
      total_messages: this.messages.length(),
      token: current_user.token
    };


    $.post(server + "chat", data,
        function (response) {
          current_chat.push.apply(current_chat.messages, response.messages);     //5x faster than looping
          //a.push.apply(a, b);    -> this seems more readable
        },
        "json");


    //every 10 seconds send latest received message timestamp
    //server responds with an array of newer messages
    // messages.push(new_message)    ->this is correct way of doing it
    //add latest timestamp to this.latest_timestamp
    //this.update
  },
  send_message: function (messages) {
    //add to local and send to remote
    $.ajax({
      url: server + "/users/auth",
      data: message,
      success: function (response) {
        //sent date time should display
      },
      error: function (response) {
        //message sending... should display. -> that should be default and it should keep it
      }
    });

    $.ajax({
      type: 'POST',
      url: server + 'chat',
      contentType: 'application/json',
      headers: { TOKEN: current_user.token },
      dataType: 'application/json',
      data: { message: messages }, //Can be Key/Value, string, or object. $.serialize called if object
      success: function (response) {
        //sent date time should display
      },
      error: function (response) {
        //message sending should continue to be displayed. retry sending every 5 seconds
      }

    });

    //add to local_storage

  },                                                              //post & update timestamp
  update: function (new_messages) {
    //Adds new messages to display window via $()
    //runs a template that only has the 2 chat of left and right and appends it to the end
  }
//    ,
//    refresh: function(){
//
//    }
});

//Instance definitions

var chat_room = {};

//Clicking chat with someone:

//Make the template first which will hold all of the functions

//First check localstorage to see if we have a chat with them
//Chat with one person saved to their userid locally
//Do a chat.userid.poll_for_messages

//