/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {
  //All views needed by controller must be listed here.
  views: ["views/people/friends_nearby_view.js", "views/people/people_nearby_view.js"],

  init: function () {


  },

  default: function () {                                         //display all previous chats                                                                   //get the local chat data

  }
});

