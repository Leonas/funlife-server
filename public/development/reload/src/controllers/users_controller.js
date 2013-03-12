/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create("users_controller", {
  //All views needed by controller must be listed here.
  views: ["views/users/user_login_view.js", "views/users/user_registration_view.js",
    "views/users/users_list_view.js"],

  init: function () {

  },

  default: function () {
    current_user.get_from_local();                           //Load current user to memory from localstorage


    if (current_user.token.length > 5) {                       //if the current user's token exists, try to auth
      current_user.authenticate_token();
    } else {
      console.log("token not found on localstorage. displaying login");
      $.mvc.route("/users_controller/user_login");
    }
  },

  user_login: function (action) {
    var form_data = $('#login_form').serialize();

    if ($("#user_login_view").length == 0) {                 //If the user_login_view div doesn't exist, make it!
      $.ui.addContentDiv("user_login_view", $.template('views/users/user_login_view.js'), "Login or Register");
    }

    $.ui.loadContent("user_login_view", false, false, "fade"); //Show the user_login_view


    if (action == "login") {                                 //If login clicked, we post to get token
      current_user.authenticate_login(form_data);
    }
    else if (action == "register") {
      current_user.register1(form_data);
    }
    current_user.save();

  },
  logout: function () {
    console.log('im here');

    if ($("#user_login_view").length == 0) {                 //If the user_login_view div doesn't exist, make it!
      $.ui.addContentDiv("user_login_view", $.template('views/users/user_login_view.js'), "Login or Register");
    } else {
      var elem = document.getElementById('user_login_view');          //otherwise form data is displayed
      elem.parentNode.removeChild(elem);                              //possible execute right after login?
      $.ui.addContentDiv("user_login_view", $.template('views/users/user_login_view.js'), "Login or Register");
    }

    current_user.logout();
    $.ui.loadContent("user_login_view", false, false, "pop"); //Show the user_login_view


  },

  user_registration: function (action) {
    if ($("#user_registration_view").length == 0) {               //If the view doesn't exist, create it
      $.ui.addContentDiv("user_registration_view",
          $.template('views/users/user_registration_view.js', current_user), "Complete Registration");
    }
    $.ui.loadContent("user_registration_view", false, false);                 //Show the user_login_view


    if (action == "complete") {                                         //If the person clicked on complete
      current_user.register2($('#registration_details_form').serialize());
    }
    current_user.save();
  },
  users_list: function () {

    $.ajax({
      type: 'GET',
      url: server + '/users/',
      dataType: 'application/json',
      headers: { TOKEN: current_user.token },

      success: function (response, statusText, xhr) {
        var data = JSON.parse(response);
        if ($("#users_list_view").length == 0) {                           //If view doesn't exist, make one
          $.ui.addContentDiv("users_list_view",
              $.template('views/users/users_list_view.js', data), "Users List View");
        } else {                                                          //otherwise, update the content inside
          $.ui.updateContentDiv("users_list_view", $.template('views/users/users_list_view.js', data));
        }
        $.ui.loadContent("users_list_view", false, false, "pop");            //show the user_list view
      },

      error: function () {

      }
    });
  }
});

