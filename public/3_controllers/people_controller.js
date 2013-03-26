/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {

  init: function () {


  },

  default: function () {
    $.ui.show_page({
      div_id: 'people_index_view',
      title: 'Following',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: false,
      data: false
    });

  },

  followers: function () {
    $.ui.show_page({
      div_id: 'people_followers_view',
      title: 'Followers',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: false,
      data: false
    });

  },

  nearby: function () {

    $.ui.show_page({
      div_id: 'people_nearby_view',
      title: 'People Nearby',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: /users/,
      data: false
    });

/*
    $.ajax({
      type: 'GET',
      url: server + '/users/',
      dataType: 'application/json',
      headers: { TOKEN: current_user.token },

      success: function (response, statusText, xhr) {
        var data = JSON.parse(response);
        //If view doesn't exist, make one
        if ($('#people_nearby_view').length == 0) {
          console.log('creating for the first time');
          $.ui.add_content_div('people_nearby_view',
              $.template('views/people/people_nearby_view.js', data), 'People Nearby View');
        }
        else {
          console.log('updating') ;
          //otherwise, update the content inside
          $.ui.update_content_div('people_nearby_view', $.template('views/people/people_nearby_view.js', data));
        }
        //show the view
        $.ui.load_content('people_nearby_view', false, false, 'fade');
      },

      error: function () {

      }
    });
    
    */
  },

  detail: function (user_id) {

    $.ui.show_page({
      div_id: 'people_detail_view',
      title: 'People',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: false,
      data: false
    });

  }
});

