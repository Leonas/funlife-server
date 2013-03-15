/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('photos_controller', {
  //All views needed by controller must be listed here.
  views: ["views/photos/index_view.js"],

  init: function () {


  },

  default: function () {                                         //display all previous chats                                                                   //get the local chat data
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_photos').addClass('ui-btn-active');

  }
});

