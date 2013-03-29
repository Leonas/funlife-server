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

$.mvc.controller.create('chats_controller', {

  init: function () {


  },

  //display all previous chats
  default: function () {                                                                                                          //get the local chat data
    //chat_room.room_list = JSON.parse(window.localStorage.getItem('chat_room_list'));

    $.ui.show_page({
      div_id: 'chat_index_view',
      title: 'Chats',
      header: '#header',
      left_button: '#top_back_button',
      right_button: '#top_new_chat_button',
      footer: '#footer',
      active_footer_button: '#bottom_nav_home',
      api_url: '/chats/'
    });

  },

  detail: function (chat_id, action, user_id) {

    $.ui.show_page({
      div_id: 'chat_detail_view',
      title: 'Chat Detail',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#chat_footer',
      active_footer_button: false,
      api_url: '/chats/'+chat_id+'/chat_messages'
    });

//    $('#chat_submit').bind('click', function () {
//      chat_id.send_message();
//    });

    //Need to do something better than this here. Everything below this line is bad
    //-------------------------------
//
//    if (JSON.parse(window.localStorage.getItem('chat_' + user_id))) {                                                       //see if we have saved chatroom data
//      chat_room[user_id] = JSON.parse(window.localStorage.getItem('chat_' + user_id));
//      console.log('a chatroom was found');
//    } else {                                                  //if not, lets make a new chatroom
//      chat_room[user_id] = new Chat();
//      console.log("just made a new chat cause an old one wasn't found");
//    }

    //chat_room[user_id].refresh();       //this needs to be implemented

    //todo
    //send the latest message_id (#embeds_many message) to the server via getJSON
    //It will return only the newest messages which should be appended to the older.


    //If the person clicked to send a message...
//    if (action === 'send') {
//
//    }

  },

  sent: function () {

    $.ui.show_page({
      div_id: 'chat_sent_view',
      title: 'Chats',
      header: '#header',
      left_button: '#top_back_button',
      right_button: '#top_new_chat_button',
      footer: '#footer',
      active_footer_button: '#bottom_nav_home',
      api_url: '/chats/sent',
      data: false
    });

  },

  new: function (action) {

    if(!action){
        $.ui.show_page({
          div_id: 'chat_new_view',
          title: 'New Chat',
          header: '#header',
          left_button: '#top_back_button',
          right_button: false,
          footer: '#footer',
          active_footer_button: '#bottom_nav_home',
          api_url: false,
          data: false
        });
    }

    if(action === 'start'){
      $.post_with_token({
        api_url: '/chats/',
        data: $('#chat_with_id').serialize(),
        success: function(response){
         //debugger;  
         var chat_id = JSON.parse(response).chat.id;
          $.mvc.route('/chats_controller/detail/'+chat_id);
          //it should save to cache so that it doesnt need to do request from other controller area
          //$.ui.cached_pages['/chats/'+chat_id+'/chat_messages'] = response;
          //$.ui.cached_pages.save();
        },
        error: function(response){
          alert('error');
        }
      });

    }


  }
});

