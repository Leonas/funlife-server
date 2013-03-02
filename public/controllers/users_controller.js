/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create("users_controller", {
    //All views needed by controller must be listed here.
    views: ["views/users/user_login_view.js", "views/users/user_registration_view.js",
            "views/users/users_list_view.js"],

    init: function () {

    },

    default: function () {
        current_user.get_from_local();                           //Load current user to memory from localstorage
        if(current_user.token.length > 5){                       //if the current user's token exists, try to auth
            if(current_user.authenticate_token()) {              //if auth successful, show the user list screen
                console.log("your token is authed");
                $.mvc.route("/users_controller/users_list_view");
            } else {
                console.log("your token failed");
                $.mvc.route("/users_controller/user_login");    //otherwise show the login screen
            }
        } else{
            console.log("user not found...redirecting to new account");
            $.mvc.route("/users_controller/user_login");
        }
    },

    user_login: function (action) {
        var form_data = $('#login_form').serialize();

        if($("#user_login_view").length == 0) {                 //If the user_login_view div doesn't exist, make it!
            $.ui.addContentDiv("user_login_view", $.template('views/users/user_login_view.js'), "Login or Register");
        }

        $.ui.loadContent("user_login_view",false,false,"pop"); //Show the user_login_view


        if(action == "login"){                                 //If login clicked, we post to get token
           current_user.authenticate_login(form_data);
        }
        else if(action == "register") {
            current_user.register1(form_data);
        }
        current_user.save();

    },
    logout: function () {

        var elem = document.getElementById('user_login_view');          //otherwise form data is displayed
        elem.parentNode.removeChild(elem);                              //possible execute right after login?

        if($("#user_login_view").length == 0) {                 //If the user_login_view div doesn't exist, make it!
            $.ui.addContentDiv("user_login_view", $.template('views/users/user_login_view.js'), "Login or Register");
        }
        current_user.logout;
        $.ui.loadContent("user_login_view",false,false,"pop"); //Show the user_login_view


    },

    user_registration: function (action) {
        if($("#user_registration_view").length == 0) {               //If the view doesn't exist, create it
            $.ui.addContentDiv("user_registration_view",
            $.template('views/users/user_registration_view.js', current_user), "Complete Registration");
        }
        $.ui.loadContent("user_registration_view",false,false);                 //Show the user_login_view


        if(action == "complete"){                                         //If the person clicked on complete
            current_user.register2($('#registration_details_form').serialize());
        }
        current_user.save();
    },
    users_list: function () {
        $.getJSON(server+'users', JSON.parse('{"token": "'+current_user.token+'"}'), function(callback){
           if($("#users_list_view").length == 0) {                           //If view doesn't exist, make one
                $.ui.addContentDiv("users_list_view",
                   $.template('views/users/users_list_view.js', callback), "Users List View");
            } else {                                                          //otherwise, update the content inside
                $.ui.updateContentDiv("users_list_view", $.template('views/users/users_list_view.js', callback));
            }
            $.ui.loadContent("users_list_view",false,false,"pop");            //show the user_list view

        });

    }
});

