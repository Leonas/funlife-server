if (typeof forge === 'undefined' && typeof device === 'undefined') {
  //if not running on a mobile device use local server
  var server = 'http://' + document.location.host;
//  var server = 'http://vast-crag-6780.herokuapp.com';
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