User = new $.mvc.model.Extend('user', {                                 //Instances defined at the bottom
  name: '',
  email: '',
  token: '',
  profile_pic: '',

  //Submit registration and move to step2 on success
  register1: function (form_data) {
    $('#wrong_password').hide();
    $('#email_exists').hide();
    $.ajax({
      type: 'POST',
      url: server + '/users/register1/',
      dataType: 'application/json',
      data: form_data,

      success: function (response, statusText, xhr) {
        console.log(response);
        current_user.token = $.parseJSON(response).token;
        current_user.save();
        $.mvc.route('/users_controller/register2');
      },

      error: function () {
        $('#email_exists').css('display', ['block']);
      }
    });
  },


  register2: function (form_data) {

    $.ajax({
      type: 'POST',
      url: server + '/users/register2/',
      dataType: 'application/json',
      headers: { 'TOKEN': current_user.token },
      data: form_data,

      success: function (response, statusText, xhr) {
        $.mvc.route('/users_controller/');
        $('#footer').show();
      },

      error: function () {
        console.log('failed registration - something went wrong');
        //Need to make this do something for the user. Connection error.
      }
    });
  },


  login: function (form_data) {
    $('#wrong_password').hide();
    $('#email_exists').hide();
    $.ajax({
      type: 'POST',
      url: server + '/users/login/',
      dataType: 'application/json',
      data: form_data,

      success: function (response, statusText, xhr) {
        current_user.token = JSON.parse(response).token;
        current_user.save();
        $.mvc.route('/users_controller/');
        $('#footer').show();
      },

      error: function () {
        $('#wrong_password').show();
      }
    });
  },

  //Save the user to local storage
  save: function () {
    window.localStorage.setItem('current_user', JSON.stringify(current_user));
  },

  //Load a user from local storage
  get_from_local: function () {
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
    console.log('Logging out. Clearing localstorage');
    window.localStorage.clear();
  }
});

//instance definitions
current_user = new User();