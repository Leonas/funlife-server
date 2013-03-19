/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('users_controller', {
  //All views needed by controller must be listed here.
  views: ['views/users/user_login_register_view.js', 'views/users/user_register2_view.js',
     'views/users/user_index_view.js'],

  init: function () {


  },

  default: function () {
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_home').addClass('ui-btn-active');

    console.log('at home');
    this.home_page();
    //this.users_list();
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
          $.ui.add_content_div('user_index_view',
              $.template('views/users/user_index_view.js'), 'Users index View');
        }
        //otherwise, update the content inside
        else {
          //$.ui.update_content_div('user_index_view', $.template('views/user/user_index_view.js'));
        }
        //show the user_index view
        $.ui.load_content('user_index_view', false, false, 'fade');
      },

      error: function () {

      }
    });


  },

  login_register: function (action) {
    //If the div doesn't exist, make it!
    if ($('#user_login_register_view').length == 0) {
      $.ui.add_content_div('user_login_register_view', $.template('views/users/user_login_register_view.js'), 'Login or Register');
    }
    //Show the view
    $.ui.load_content('user_login_register_view', false, false, 'fade');

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
      $.ui.add_content_div('user_register2_view',
          $.template('views/users/user_register2_view.js', current_user), 'Complete Registration');
    }
    //Show the user_login_view
    $.ui.load_content('user_register2_view', false, false, 'fade');


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
      $.ui.add_content_div('user_login_register_view', $.template('views/users/user_login_register_view.js'), 'Login or Register');
    } else {

      //this deletes the whole view just to get rid of the login form data
      //This whole screen should be deleted right after login if that saves on memory/is garbage collected
      //Rewrite how all the screens work if its better to delete each one

      var elem = document.getElementById('user_login_register_view');
      elem.parentNode.removeChild(elem);
      $.ui.add_content_div('user_login_register_view', $.template('views/users/user_login_register_view.js'), 'Login or Register');
    }

    //

    //Show the user_login_view
    $.ui.load_content('user_login_register_view', false, false, 'fade');


  }


});

