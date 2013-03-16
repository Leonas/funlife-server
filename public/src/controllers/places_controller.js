/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('places_controller', {
  //All views needed by controller must be listed here.
  views: ['views/places/places_index_view.js'],

  init: function () {


  },

  default: function () {
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_places').addClass('ui-btn-active');

    //If the view div doesn't exist, make it!
    if ($('#places_index_view').length == 0) {
      $.ui.addContentDiv('places_index_view', $.template('views/places/places_index_view.js'), 'places');
      $('#places_index_view').gmaps({
        center: new google.maps.LatLng(37.76, -122.43),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    }
    //Show the view
    $.ui.loadContent('places_index_view', false, false, 'fade');


  }


});
