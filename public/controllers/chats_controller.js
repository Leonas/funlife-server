/*global alert: false, confirm: false, console: false, $: false */

var chat_log = {
    "chat_info": {
        "chat_id": "23213123",
        "my_photo": "photo_url_on_phone",
        "person2_photo": "photo_url",
        "person2": "Bob"
    },
    "messages": [  //server should make sure these messages are aligned in right order

        {
            "timestamp": "0",
            "user": "Bob",
            "text": "hello there"
        },
        {
            "timestamp": "1",
            "user": "Sam",
            "text": "hey whats up"
        },
        {
            "timestamp": "2",
            "user": "Bob",
            "text": "nothing much"
        },
        {
            "timestamp": "3",
            "user": "Bob",
            "text": "what u doing"
        }
    ]
};

$.mvc.controller.create("chats_controller", {
    //All views needed by controller must be listed here.
    views: ["views/chats/chat_view.js", "views/chats/chat_list_view.js"],

    init: function () {


    },

    default: function () {                                         //display all previous chats                                                                   //get the local chat data
        chat_room.room_list = JSON.parse(window.localStorage.getItem("chat_room_list"));

    },

    chat: function (user_id, action, chat_id) {

        $("#chat_submit").bind("click",function(){
            chat_id.send_message();

        });

        if($("#chat_view").length == 0) {
            $.ui.addContentDiv("chat_view", $.template('views/chats/chat_view.js', chat_log), "Chat");
        }

        if(JSON.parse(window.localStorage.getItem("chat_"+user_id))){                                                       //see if we have saved chatroom data
            chat_room[user_id] = JSON.parse(window.localStorage.getItem("chat_"+user_id));
            console.log("a chatroom was found");
        } else {                                                  //if not, lets make a new chatroom
            chat_room[user_id] = new Chat();
            console.log("just made a new chat cause an old one wasn't found") ;
        }

        //chat_room[user_id].refresh();       //this needs to be implemented



        //Show the chat_view
        $.ui.loadContent("chat_view",false,false,"pop");

        //todo
        //send the latest message_id (#embeds_many message) to the server via getJSON
        //It will return only the newest messages which should be appended to the older.


        //If the person clicked to send a message...
        if(action == "send"){

        }
    }
});

