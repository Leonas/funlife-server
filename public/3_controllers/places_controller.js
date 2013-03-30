/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('places_controller', {

  init: function () {


  },

  default: function () {

    $.ui.show_page({
      div_id              : 'places_index_view',
      title               : 'Places',
      header              : '#header',
      left_button         : false,
      right_button        : false,
      footer              : '#footer',
      active_footer_button: '#bottom_nav_places',
      url                 : false,
      data                : false
    });

    $('#places_index_view').gmaps({
      center   : new google.maps.LatLng(37.76, -122.43),
      zoom     : 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

  }


});

