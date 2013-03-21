/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {
  //All views needed by controller must be listed here.
  views: ['views/people/people_index_view.js', 'views/people/people_followers_view.js',
    'views/people/people_nearby_view.js', 'views/people/people_detail_view.js'],

  init: function () {


  },

  default: function () {
    $('#bottom_nav_home').removeClass('active_footer_button');
    $('#bottom_nav_photos').removeClass('active_footer_button');
    $('#bottom_nav_places').removeClass('active_footer_button');
    $('#bottom_nav_people').removeClass('active_footer_button');
    $('#bottom_nav_people').addClass('active_footer_button');

    //If the view div doesn't exist, make it!
    if ($("#people_index_view").length == 0) {
      $.ui.add_content_div("people_index_view", $.template('views/people/people_index_view.js'), "People");
    }
    //Show the view
    $.ui.load_content("people_index_view", false, false, "fade");

  },

  followers: function () {

    //If the view div doesn't exist, make it!
    if ($("#people_followers_view").length == 0) {
      $.ui.add_content_div("people_followers_view", $.template('views/people/people_followers_view.js'), "People");
    }
    //Show the view
    $.ui.load_content("people_followers_view", false, false, "fade");

  },

  nearby: function () {
    $.ajax({
      type: 'GET',
      url: server + '/users/',
      dataType: 'application/json',
      headers: { TOKEN: current_user.token },

      success: function (response, statusText, xhr) {
        var data = JSON.parse(response);
        //If view doesn't exist, make one
        if ($('#people_nearby_view').length == 0) {
          $.ui.add_content_div('people_nearby_view',
              $.template('views/people/people_nearby_view.js', data), 'People Nearby View');
        }
        else {
          //otherwise, update the content inside
          $.ui.update_content_div('people_nearby_view', $.template('views/people/people_nearby_view.js', data));
        }
        //show the view
        $.ui.load_content('people_nearby_view', false, false, 'fade');
      },

      error: function () {

      }
    });
  },

  detail: function (user_id) {
    //If the view div doesn't exist, make it!
    if ($("#people_detail_view").length == 0) {
      $.ui.add_content_div("people_detail_view", $.template('views/people/people_detail_view.js'), "People");
    }
    //Show the view
    $.ui.load_content("people_detail_view", false, false, "fade");

  }
});

