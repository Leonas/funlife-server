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
Person = new $.mvc.model.Extend('person', {

});

//Instance definitions

var people = {};
Photo = new $.mvc.model.Extend('photo', {

});

//Instance definitions

var photos = {};
Place = new $.mvc.model.Extend('place', {

});

//Instance definitions

var places = {};
var User = new $.mvc.model.Extend('user', {                                 //Instances defined at the bottom
  name: '',
  email: '',
  token: '',
  profile_pic: '',

  save: function () {
    window.localStorage.setItem('current_user', JSON.stringify(this));
    //TODO post to server as well?
  },

  //Load a user from local storage
  load_local_data: function () {
    try {
      var saved_user = JSON.parse(window.localStorage.getItem('current_user'));
      if (saved_user.token.length > 5) {
        current_user.name = saved_user.name;
        current_user.email = saved_user.email;
        current_user.token = saved_user.token;
      }
    } catch (e) {
      current_user.token = 'guest';
    }
  },
  logout: function () {
    //TODO post to server to clear token
    window.localStorage.clear();
  }
});

//instance definitions
var current_user = new User();
console.log('user created');

function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};}
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl=tmpl|| {};
 tmpl.activity_detail_attending_view=function anonymous(it) {
var out='';return out;
};
 tmpl.activity_detail_info_view=function anonymous(it) {
var out='';return out;
};
 tmpl.activity_detail_join_view=function anonymous(it) {
var out='';return out;
};
 tmpl.chat_detail_view=function anonymous(it) {
var out='<br><!--';var arr1=it.chat_log;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='Chatting with '+(value.chat_info.person2);if(value.messages.name === current_user.name){out+='<div class=\'chat_message_left\'><div class=\'userimg\' style=\'background-image:url('+(value.userimg)+');\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p></div></div>';}else if(value.level != true){out+='<div class=\'chat_message_right\'><div class=\'userimg\' style=\'background-image: url('+(value.userimg)+')\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p></div></div>';}} } out+='--><div class="row-fluid"><div class="span2"><img class="img-polaroid" src="/photos/7.png"></div><div class="span9 offset1 well well-small"><small class="muted">7:10pm</small><p> Hello Bob! How are you doing? </p></div></div><div class="row-fluid"><div class="span9 well well-small"><small class="muted">7:12pm</small><p>I\'m doing good how are you?</p></div><div class="span2"><img class="img-polaroid" src="/photos/5.png"></div></div>';return out;
};
 tmpl.chat_index_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span6 btn text-info" href=\'/chats_controller/\'>Recieved</a><a class="span6 btn" href=\'/chats_controller/sent/\'>Sent</a></div><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a>';return out;
};
 tmpl.chat_list_view=function anonymous(it) {
var out='All your chats:<table><tr><td>Email</td><td>Name</td><td>Chat</td><tr>';var arr1=it.chat_list;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<tr><td>'+(value.email)+'</td><td>'+(value.name)+'</td><td><a href="/chats_controller/chat/'+(value.user_id)+'">View</a></td></tr>';} } out+='</table>';return out;
};
 tmpl.chat_new_view=function anonymous(it) {
var out='chats_new_view';return out;
};
 tmpl.chat_sent_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span6 btn" href=\'/chats_controller/\'>Recieved</a><a class="span6 btn text-info" href=\'/chats_controller/sent/\'>Sent</a></div><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/3.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Billy Bob</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a>';return out;
};
 tmpl._comments=function anonymous(it) {
var out='Hello, I am on the _comments.js partial view <br><a href="/hello">Go Back</a>';var arr1=it.comments;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];if(value.level == 1){out+='<div class=\'commentLevel1\'><div class=\'userimg\' style=\'background-image:url('+(value.userimg)+');\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p><a class=\'button\' href=\'#reply\'>Reply</a></div></div>';}else if(value.level == 2){out+='<div class=\'commentLevel2\'><div class=\'userimg\' style=\'background-image: url('+(value.userimg)+')\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p><a class=\'button\' href=\'#reply\'>Reply</a></div></div>';}else{out+='<div class=\'commentLevel3\'><div class=\'userimg\' style=\'background-image: url('+(value.userimg)+')\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p><a class=\'button\' href=\'#reply\'>Reply</a></div></div>';}} } return out;
};
 tmpl.people_detail_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn text-info" href=\'/people_controller/profile\'>Profile</a><a class="span4 btn" href=\'/people_controller/profile/comments\'>Comments</a><a class="span4 btn" href=\'/people_controller/profile/photos\'>Photos</a></div><br><div class=\'row-fluid\'><div class=\'span3\'><img class=\'img-polaroid\' src="/layout/img/user_placeholder.jpeg"></div><div class=\'span8 offset1\'><div class=\'row-fluid lead\'>FirstName LastName</div><div class=\'row-fluid text-center\'><ul class="nav nav-pills"><li class="active"><a>344<br><small>Followers</small></a></li><li class="active"><a>423<br><small>Following</small></a></li><li class="active"><a>&nbsp<br><small>Status</small></a></li></ul></div></div></div><div class=\'row-fluid\'><div class=\'span2\'><button class="btn btn-large btn-success disabled">7 Trust</button></div><div class=\'span3 offset2\'><a href=\'#\' class=\'btn btn-small btn-info btn-block\'>Trust</a><a href=\'/chats_controller/detail/chatid/new/userid\' class=\'btn btn-small btn-info btn-block\'>Chat</a></div><div class=\'span3 offset1\'><a href=\'#\' class=\'btn btn-small btn-info btn-block\'>Follow</a><a href=\'#\' class=\'btn btn-small btn-info btn-block\'>Invite</a></div></div><br><div class=\'row-fluid text-center label label-info\'>Feedback Score: 83</div><br><div class=\'row-fluid label\'>Activities I want to be invited to</div><div class=\'row-fluid\'>todo</div><br><div class=\'row-fluid label\'>Activities completed</div>';return out;
};
 tmpl.people_followers_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn" href=\'/people_controller/\'>Following</a><a class="span4 btn text-info" href=\'/people_controller/followers/\'>Followers</a><a class="span4 btn" href=\'/people_controller/nearby/\'>Nearby</a></div>';return out;
};
 tmpl.people_index_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn text-info" href=\'/people_controller/\'>Following</a><a class="span4 btn" href=\'/people_controller/followers/\'>Followers</a><a class="span4 btn" href=\'/people_controller/nearby/\'>Nearby</a></div><br><br><br><br><br><a href=\'http:<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index viewvvvv<br><br><br><br><br>People index view<br><br><br><br><br>People index viewvvvvv<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index viewvvv<br><br><br><br><br>People index view';return out;
};
 tmpl.people_nearby_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn" href=\'/people_controller/\'>Following</a><a class="span4 btn" href=\'/people_controller/followers/\'>Followers</a><a class="span4 btn text-info" href=\'/people_controller/nearby/\'>Nearby</a></div>';var arr1=it.users;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];if(index != 0 && index % 4 === 0){out+='</ul></div>';}if(index % 4 === 0){out+='<div class="row-fluid"><ul class="thumbnails">';}out+='<li class="span3"><a id="chat_'+(value.user_id)+'" href="/people_controller/detail/'+(value.user_id)+'" class="thumbnail"><img src="/layout/img/user_placeholder.jpeg">'+(value.name)+'</a></li>';} } out+='</ul></div>';return out;
};
 tmpl.photo_detail_view=function anonymous(it) {
var out='<div class=\'row-fluid\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span6\'>Larissa Jane</div><div class=\'span1\'><img src=\'layout/img/icons/comment_bubble.png\'></div><div class=\'span1\'><img src=\'layout/img/icons/photo_likes.png\'></div></div><div class=\'row-fluid\'><div class=\'span10 offset1\'><img src=\'/photos/7.png\'></div></div><div class=\'row-fluid\'><div class=\'span10\'>Nashville Concert Hall, Nashville</div><div class=\'span2\'><a href=\'/photos_controller/detail/photo_id/comment/\' class=\'btn btn-small\'>Comment</a></div></div>';return out;
};
 tmpl.photos_index_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn text-info" href=\'/photos_controller/\'>Following</a><a class="span4 btn" href=\'/photos_controller/explore/\'>Explore</a><a class="span4 btn" href=\'/photos_controller/my_photos/\'>My Photos</a></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div>';return out;
};
 tmpl.places_index_view=function anonymous(it) {
var out='';return out;
};
 tmpl.user_index_view=function anonymous(it) {
var out='<ul class="breadcrumb"><li>My Activities</li></ul><div class="row-fluid"><ul class="thumbnails"><li class="span3 text-center"><a href="/activity_controller/new" class="thumbnail no_borders"><img src="/layout/img/create_activity.png"></a></li><li class="span3 text-center"><a href="/chats_controller/" class="thumbnail no_borders"><img src="/layout/img/chats.png"></a></li><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/soccer.png"><small>Today<br>4:30pm</small></a></li><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/cards.png"><small>Wednesday 11/24<br>9:30pm</small></a></li></ul></div><ul class="breadcrumb"><li>Today\'s Activities</li></ul><div class="row-fluid"><ul class="thumbnails"><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/pool.png"><small>2.1 mi<br>7:30pm</small></a></li><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/basketball.png"><small>3.7 mi<br>8:30pm</small></a></li></ul></div><ul class="breadcrumb"><li>Tomorrow\'s Activities</li></ul>';return out;
};
 tmpl.user_login_register_view=function anonymous(it) {
var out='<div><div class="row-fluid text-center"><br><br><h1>FunLife</h1><br><div id="login_error" class="alert"></div><br><br><div id="login_holder"><form id="login_form"><input id=\'#login_form_email_field\' type="text" name="user[email]" placeholder="email"><br><input id=\'#login_form_password_field\' type="text" name="user[password]" placeholder="password"></form><ul class="pager"><li><a href="/users_controller/login_register/register">Register</a></li><li><a href="/users_controller/login_register/login">Login</a></li></ul></div></div></div>';return out;
};
 tmpl.user_register2_view=function anonymous(it) {
var out='<div class="container-fluid"><div class="row-fluid text-center"><br><br><h3>Tell us a little about yourself:</h3><br><div id="registration_details"><form id="registration_details_form"><input type="text" name="user[first_name]"  placeholder="first name"><input type="text" name="user[last_name]" placeholder="last name"></form><a href="/users_controller/register2/complete" class="btn btn-success">Complete Registration</a></div></div></div>';return out;
};

if (typeof forge === 'undefined' && typeof device === 'undefined') {
  //if not running on a mobile device use local server
  var server = 'http://' + document.location.host;
} else {
  //connect to heroku if running on phone
  var server = 'http://vast-crag-6780.herokuapp.com';
}

var debug;        //for testing stuff
var current_user;
var app = new $.mvc.app();
//app.loadModels(['user', 'chat', 'person', 'place', 'photo']);
//app.loadControllers(['users_controller', 'chats_controller', 'people_controller',
//  'places_controller', 'photos_controller']);
app.listenHashChange();
app.useHTML5History(true);
//return $(document).trigger("$.ui.ready");
$.ui.ready(function () {
  console.log('ui launch detected...');
  current_user.load_local_data();


  if (current_user.token.length > 5) {
    console.log('token found, routing to home');
    $.mvc.route('/users_controller/');
  } else {
    console.log('no token found, routing to login');
    $.mvc.route('/users_controller/login_register');
  }
});