/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('places_controller', {
  //All views needed by controller must be listed here.
  views: ["views/places/places_index_view.js"],

  init: function () {


  },

  default: function () {                                                                                                        //get the local chat data
    $('#bottom_nav_home').removeClass('ui-btn-active');
    $('#bottom_nav_photos').removeClass('ui-btn-active');
    $('#bottom_nav_places').removeClass('ui-btn-active');
    $('#bottom_nav_people').removeClass('ui-btn-active');
    $('#bottom_nav_places').addClass('ui-btn-active');

    if ($("#places_index_view").length == 0) {                 //If the view div doesn't exist, make it!
      $.ui.addContentDiv("places_index_view", $.template('views/places/places_index_view.js'), "places");

        $("#places_index_view").gmaps({
          center: new google.maps.LatLng(37.76, -122.43),
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });



    }
    $.ui.loadContent("places_index_view", false, false, "fade"); //Show the view



  }


});

