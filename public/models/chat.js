chat_log = {
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
Chat = new $.mvc.model.Extend("chat",{
    chat_id: '',
    my_photo: function() {
        return current_user.profile_pic;                          //this might keep getting executed multiple times
    },
    messages: [],
    refresh: function() {
       return "bob";
    },
    poll_for_messages: function(){

    },
    send_message: function(){
                                                                    //add to local_storage

    }                                                              //send remotely & update timestamp
});

//Instance definitions

var chat_room = {};