/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('users_controller', {
  init: function () {


  },


  default: function () {
    $.ui.show_page({
       div_id: 'user_index_view',
       title: 'FunLife',
       header: '#header',
       left_button: false,
       right_button: '#top_logout_button',
       footer: '#footer',
       active_footer_button: '#bottom_nav_home',
       api_url: '/users/',
       data: false
    });

  },

  login_register: function (action) {

   //remove a 'wrong password' error if shown from previous try
    $('#login_error').hide();


    switch (action) {
    case undefined:
      current_user.token = 'guest';
      $.ui.show_page({
        div_id: 'user_login_register_view',
        title: false,
        header: false,
        left_button: false,
        right_button: false,
        footer: false,
        active_footer_button: false,
        api_url: false,
        data: false
      });
      break;

    case 'login':


      $.ajax({
        type: 'POST',
        dataType: 'application/json',
        url: server+'/sessions/',
        data: $('#login_form').serialize(),
        success: function (response, statusText, xhr) {
          current_user.token = 'Basic ' + Base64.encode(JSON.parse(response).user.token);
          current_user.save();
          $.mvc.route('/users_controller/');
        },
        error: function (xhr, error ){
          if (xhr.status === 401) {
            $('#login_error').html('Wrong Password').show();
          }
          else {
            $('#login_error').html('Connection error...').show();
          }
        }
      });
      break;

    case 'register':

      $.ajax({
        type: 'POST',
        dataType: 'application/json',
        data: $('#login_form').serialize(),
        url: server+'/users/',
        success: function (response, success, xhr) {
          current_user.token = 'Basic ' + Base64.encode(JSON.parse(response).user.token);
          current_user.save();
          $.mvc.route('/users_controller/register2');
        },
        error: function(xhr, error ){
          if (xhr.status === 422) {
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
      case undefined:
        $.ui.show_page({
          title: 'Complete Your Registration',
          active_nav: false,
          div_id: 'user_register2_view',
          left_button: false,
          api_url: false,
          data: false
        });
        break;

      case 'complete':
        $.put_with_token({
          api_url: '/users/',
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

