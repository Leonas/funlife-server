/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('users_controller', {
  //All views needed by controller must be listed here.
  views: ['views/users/user_login_register_view.js', 'views/users/user_register2_view.js',
     'views/users/user_index_view.js'],

  init: function () {


  },

  default: function () {

    $.show_page({
       title: 'FunLife',
       active_nav: '#bottom_nav_home',
       div_id: 'user_index_view',
       template: 'views/users/user_index_view.js',
       back_button: true,
       api_url: '/users/',
       data: {}
    });

  },

  login_register: function (action) {

    //remove a 'wrong password' error if shown from previous try
    $('#login_error').hide();

    switch (action) {
    case null:
      $.show_page({
        title: 'Login or Register',
        active_nav: false,
        div_id: 'user_login_register_view',
        template: 'views/users/user_login_register_view.js',
        back_button: false,
        api_url: false,
        data: false
      });
      break;

    case 'login':
      $.post_without_token({
        api_url: '/users/login/',
        data: $('#login_form').serialize(),
        success: function (response, statusText, xhr) {
          current_user.token = JSON.parse(response).token;
          current_user.save();
          $.mvc.route('/users_controller/');
        },
        error: function () {
          //TODO fix this function to make it work right
          if (data === XXX) {
            $('#login_error').html('Wrong Password').show();
          }
          else {
            $('#login_error').html('Connection error...').show();
          }
        }
      });
      break;

    case 'register':
      $.post_without_token({
        api_url: '/users/register1/',
        data: $('#login_form').serialize(),
        success: function (response) {
          current_user.token = $.parseJSON(response).token;
          current_user.save();
          $.mvc.route('/users_controller/register2');
        },
        error: function (data) {
          //TODO fix this function to make it work right
          if (data === XXX) {
            $('#login_error').html('An account with that email already exists. Login instead?').show();
          }
          else {
            $('#login_error').html('Connection error...').show();
          }
        }
      });
      break;
    }
  },

  register2: function (action) {

    switch (action) {
      case null:
        $.show_page({
          title: 'Complete Your Registration',
          active_nav: false,
          div_id: 'user_register2_view',
          template: 'views/users/user_register2_view.js',
          back_button: false,
          api_url: false,
          data: false
        });
        break;

      case 'complete':
        $.post_with_token({
          api_url: '/users/register2/',
          data: $('#registration_details_form').serialize(),
          success: function () {
            $.mvc.route('/users_controller/');
            $('#footer').show();
          },
          error: function () {
            //TODO Make this show connection error
          }
        });
        break;
    }

  },

  logout: function () {
    current_user.logout();
    $.mvc.route('/users_controller/login_register');
  }


});

