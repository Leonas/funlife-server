User = new $.mvc.model.Extend('user', {                                 //Instances defined at the bottom
  name: '',
  email: '',
  token: '',
  profile_pic: '',

  save: function () {
    window.localStorage.setItem('current_user', JSON.stringify(this));
    //TODO post to server as well?
  },

  //Load a user from local storage
  load_local_data: function () {
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
    //TODO post to server to clear token
    window.localStorage.clear();
  }
});

//instance definitions
current_user = new User();