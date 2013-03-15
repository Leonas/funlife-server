/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {
  //All views needed by controller must be listed here.
  views: ['views/people/people_index_view.js', 'views/people/people_followers_view.js',
          'views/people/people_nearby_view.js', 'views/people/people_detail_view.js'],

  init: function () {


  },

  default: function () {
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_people').addClass('ui-btn-active');

    if ($("#people_index_view").length == 0) {                 //If the view div doesn't exist, make it!
      $.ui.addContentDiv("people_index_view", $.template('views/people/people_index_view.js'), "People");
    }
    $.ui.loadContent("people_index_view", false, false, "fade"); //Show the view

  },

  followers: function () {

    if ($("#people_followers_view").length == 0) {                 //If the view div doesn't exist, make it!
      $.ui.addContentDiv("people_followers_view", $.template('views/people/people_followers_view.js'), "People");
    }
    $.ui.loadContent("people_followers_view", false, false, "fade"); //Show the view

  },

  nearby: function () {
    $.ajax({
      type: 'GET',
      url: server + '/users/',
      dataType: 'application/json',
      headers: { TOKEN: current_user.token },

      success: function (response, statusText, xhr) {
        var data = JSON.parse(response);
        if ($('#people_nearby_view').length == 0) {                           //If view doesn't exist, make one
          $.ui.addContentDiv('people_nearby_view',
              $.template('views/people/people_nearby_view.js', data), 'People Nearby View');
        }
        else {                                                          //otherwise, update the content inside
          $.ui.updateContentDiv('people_nearby_view', $.template('views/people/people_nearby_view.js', data));
        }
        $.ui.loadContent('people_nearby_view', false, false, 'fade');            //show the user_list view
      },

      error: function () {

      }
    });
  },

  detail: function(user_id){
    if ($("#people_detail_view").length == 0) {                 //If the view div doesn't exist, make it!
      $.ui.addContentDiv("people_detail_view", $.template('views/people/people_detail_view.js'), "People");
    }
    $.ui.loadContent("people_detail_view", false, false, "fade"); //Show the view

  }
});

