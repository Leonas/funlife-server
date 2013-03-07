User = new $.mvc.model.Extend("user", {                                 //Instances defined at the bottom
    name: '',
    email:'',
    token:'',
    profile_pic:'',


    authenticate_token: function(redirect_choices) {                 //check if the token is valid

        var data = {
            name: current_user.name,
            email: current_user.email,
            token: current_user.token
        };

        var auth = function auth(response){
            console.log('auth succeeded if next log is true:');
            console.log(response.status === 'success');
            redirect_choices(response.status);
        }

//        var doodoo = $.post(server+"authenticate_token", data);
//        doodoo.success(auth);

        $.ajax({
            url:server+"authenticate_token",
            data: data,
            success: function(response){auth(response)},
            error: function(response){auth(response)}
        });

    },



    register1:function (form_data) {                                    //register part 1
        $.post(server+"users",form_data, function(callback){

            current_user.token = $.parseJSON(callback).token;

            if(current_user.token != "error"){
                current_user.save();
                $.mvc.route("/users_controller/user_registration");
            }
            else{
                $("#email_exists").css('display',['block']);
            }
        });
    },



    register2:function(form_data) {
        $.post(server+"register",form_data, function(callback){        //register part 2
            if(callback.token.length > 5 && callback.token != "error"){
                current_user.name = callback.name;
                current_user.email = callback.email;
                current_user.token = callback.token;
                current_user.save();
                $.mvc.route("/users_controller/users_list");
            }
            else{
                console.log("failed registration - something went wrong");
            }
        }, "json")
    },



    authenticate_login: function(form_data) {
        $.post(server+"login",form_data, function(callback){
            console.log("this is the callback:");
            console.log(callback);
            current_user.token = callback.token;

            if(current_user.token.length && current_user.token != "error"){
                current_user.save();
                $.mvc.route("/users_controller/users_list");
            } else{
                $("#wrong_password").css('display',['block']);
            }
        },
    "json")},



    save: function () {                                             //Save the user to local storage
        window.localStorage.setItem("current_user", JSON.stringify(current_user));
    },



    get_from_local: function () {                                  //Load a user from local storage
        try {                                                      //if one exists, return true/false
            var saved_user = JSON.parse(window.localStorage.getItem("current_user"));
            if(saved_user.token.length > 5) {
                current_user.name = saved_user.name;
                current_user.email = saved_user.email;
                current_user.token = saved_user.token;
            }
        } catch(e) {
            current_user.token = 'guest';
        }
    },


    logout: function () {
        console.log("Logging out. Destroying localStorage currentUser");
        window.localStorage.removeItem("current_user");
    }
});

//instance definitions
current_user  = new User();