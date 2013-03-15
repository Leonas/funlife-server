/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('places_controller', {
  //All views needed by controller must be listed here.
  views: ["views/places/places_map_view.js"],

  init: function () {


  },

  default: function () {                                                                                                        //get the local chat data
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_places').addClass('ui-btn-active');
  }
});

