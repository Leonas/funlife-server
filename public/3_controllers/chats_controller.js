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
      url: '/chats/'
    });

  },

  detail: function (chat_id, action, user_id) {

    if(!action){
      console.log('showing detail page');
        $.ui.show_page({
          div_id: 'chat_detail_view',
          title: 'Chat Detail',
          header: '#header',
          left_button: '#top_back_button',
          right_button: false,
          footer: '#chat_footer',
          active_footer_button: false,
          url: '/chats/'+chat_id+'/chat_messages'
        });
        $('#chat_send_button').attr('href', '/chats_controller/detail/'+chat_id+'/send');
    }
    
        //If the person clicked to send a message...
    if (action === 'send') {
      console.log('sending data');
        $.post_with_token({
            url: '/chats/'+chat_id+'/chat_messages',
            data: $('#chat_footer_form').serialize(),
            success: function(){
                //append using a template snippet?
            },
            error: function(){
                alert('nrow');
                //append with with 'sending...'
              //add to upload queue
            }   
        });
    }

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
      url: '/chats/sent',
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
          url: false,
          data: false
        });
    }

    if(action === 'start'){
      $.post_with_token({
        url: '/chats/',
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

