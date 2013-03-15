/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {
  //All views needed by controller must be listed here.
  views: ["views/people/friends_nearby_view.js", "views/people/people_nearby_view.js"],

  init: function () {


  },

  default: function () {                                                                                                        //get the local chat data
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_people').addClass('ui-btn-active');
  }
});

