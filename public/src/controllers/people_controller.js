/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {
  //All views needed by controller must be listed here.
  views: ['views/people/people_index_view.js', 'views/people/friends_nearby_view.js', 'views/people/people_nearby_view.js'],

  init: function () {


  },

  default: function () {                                                                                                        //get the local chat data
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_people').addClass('ui-btn-active');

    if ($("#people_index_view").length == 0) {                 //If the view div doesn't exist, make it!
      $.ui.addContentDiv("people_index_view", $.template('views/people/people_index_view.js'), "People");
    }
    $.ui.loadContent("people_index_view", false, false, "fade"); //Show the view

  }
});

