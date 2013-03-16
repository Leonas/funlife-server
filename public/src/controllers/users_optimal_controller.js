/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('users_controller', {
  //All views needed by controller must be listed here.
  views: ['views/users/user_login_register_view.js', 'views/users/user_register2_view.js',
     'views/users/user_index_view.js'],

  init: function () {


  },

  default: function () {
    $.set_bottom_nav('home');
    $.getSecure('/users/', )
    //now some promise thing should be here
    $.show_page('views/users/user_index_view.js', 'Title', data); //Takes care of adding/updating

    $.if_local_then_instant() //loads a page instantly if localstorage stuff is there
    $.wait_for_ajax() //shows a spinner until ajax returns


  },

  home_page: function () {

    //This ajax request is not going to the correct place
    $.ajax({
      type: 'GET',
      url: server + '/users/',
      dataType: 'application/json',
      headers: { TOKEN: current_user.token },

      success: function (response, statusText, xhr) {
        var data = JSON.parse(response);
        //If view doesn't exist, make one
        if ($('#user_index_view').length == 0) {
          $.ui.addContentDiv('user_index_view',
              $.template('views/users/user_index_view.js'), 'Users index View');
        }
        //otherwise, update the content inside
        else {
          //$.ui.updateContentDiv('user_index_view', $.template('views/user/user_index_view.js'));
        }
        //show the user_index view
        $.ui.loadContent('user_index_view', false, false, 'fade');
      },

      error: function () {

      }
    });


  },

  login_register: function (action) {
    //If the div doesn't exist, make it!
    if ($('#user_login_register_view').length == 0) {
      $.ui.addContentDiv('user_login_register_view', $.template('views/users/user_login_register_view.js'), 'Login or Register');
    }
    //Show the view
    $.ui.loadContent('user_login_register_view', false, false, 'fade');

    var form_data = $('#login_form').serialize();

    //If login attempt auth
    if (action == 'login') {
      current_user.login(form_data);
      //This is here because I couldn't save it from within the object. fix plz
      current_user.save();
    }
    else if (action == 'register') {
      current_user.register1(form_data);
      //This is here because I couldn't save it from within the object. fix plz
      current_user.save();
    }
  },



  register2: function (action) {
    //If the view doesn't exist, create it
    if ($('#user_register2_view').length == 0) {
      $.ui.addContentDiv('user_register2_view',
          $.template('views/users/user_register2_view.js', current_user), 'Complete Registration');
    }
    //Show the user_login_view
    $.ui.loadContent('user_register2_view', false, false, 'fade');


    if (action == 'complete') {
      current_user.register2($('#registration_details_form').serialize());
    }
    current_user.save();
  },



  logout: function () {
    current_user.logout();
    $('#footer').hide();

    //If the div doesn't exist, make it!
    if ($('#user_login_register_view').length == 0) {
      $.ui.addContentDiv('user_login_register_view', $.template('views/users/user_login_register_view.js'), 'Login or Register');
    } else {

      //this deletes the whole view just to get rid of the login form data
      //This whole screen should be deleted right after login if that saves on memory/is garbage collected
      //Rewrite how all the screens work if its better to delete each one

      var elem = document.getElementById('user_login_register_view');
      elem.parentNode.removeChild(elem);
      $.ui.addContentDiv('user_login_register_view', $.template('views/users/user_login_register_view.js'), 'Login or Register');
    }

    //

    //Show the user_login_view
    $.ui.loadContent('user_login_register_view', false, false, 'fade');


  }


});

