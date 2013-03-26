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
$.ui.ready(function () {
  //When the ui_loader has run, this executes ?
  current_user.get_from_local();                           //Load current user to memory from localstorage


  if (current_user.token.length > 5) {                       //if the current user's token exists, try to auth
    $.mvc.route('/users_controller/');
  } else {
    $.mvc.route('/users_controller/login_register');
  }
});