User = new $.mvc.model.Extend("user", {                                 //Instances defined at the bottom
  name: '',
  email: '',
  token: '',
  profile_pic: '',


  authenticate_token: function () {                 //check if the token is valid
  //this is a bad function. if the person has no signal and this fails, he gets redirected to login
    var data = {
      name: current_user.name,
      email: current_user.email,
      token: current_user.token
    };


    $.ajax({
      type: 'GET',
      url: server + "/user/auth/",
      contentType: 'application/json',
      headers: { TOKEN: current_user.token },
      data: data,
      dataType: 'application/json',
      success: function () {
        $.mvc.route("/users_controller/users_list");
      },
      error: function (response) {
        $.mvc.route("/users_controller/user_login");
      }
    });

  },


  register1: function (form_data) {                                    //register part 1
    $("#wrong_password").hide();
    $("#email_exists").hide();
    $.ajax({
      type: 'POST',
      url: server + '/users/register1/',
      dataType: 'application/json',
      data: form_data,

      success: function (response, statusText, xhr) {
        console.log(response);
        current_user.token = $.parseJSON(response).token;
        current_user.save();
        $.mvc.route("/users_controller/user_registration");
      },

      error: function () {
        $("#email_exists").css('display', ['block']);
      }
    });
  },


  register2: function (form_data) {

    $.ajax({
      type: 'POST',
      url: server + '/users/register2/',
      dataType: 'application/json',
      headers: { "TOKEN": current_user.token },
      data: form_data,

      success: function (response, statusText, xhr) {
        $.mvc.route("/users_controller/users_list");
      },

      error: function () {
        console.log("failed registration - something went wrong");
      }
    });
  },


  authenticate_login: function (form_data) {
    $("#wrong_password").hide();
    $("#email_exists").hide();
    $.ajax({
      type: 'POST',
      url: server + '/users/login/',
      dataType: 'application/json',
      data: form_data,

      success: function (response, statusText, xhr) {
        current_user.token = JSON.parse(response).token;
        current_user.save();
        $.mvc.route("/users_controller/users_list");
      },

      error: function () {
        $("#wrong_password").show();
      }
    });
  },


  save: function () {                                             //Save the user to local storage
    window.localStorage.setItem("current_user", JSON.stringify(current_user));
  },


  get_from_local: function () {                                  //Load a user from local storage
    try {                                                      //if one exists, return true/false
      var saved_user = JSON.parse(window.localStorage.getItem("current_user"));
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
    console.log("Logging out. Clearing localstorage");
    window.localStorage.clear();
  }
});

//instance definitions
current_user = new User();