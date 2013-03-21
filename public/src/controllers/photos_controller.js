/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('photos_controller', {
  //All views needed by controller must be listed here.
  views: ['views/photos/photos_index_view.js', 'views/photos/photo_detail_view.js'],

  init: function () {


  },

  default: function () {
    $('#bottom_nav_home').removeClass('active_footer_button');
    $('#bottom_nav_photos').removeClass('active_footer_button');
    $('#bottom_nav_places').removeClass('active_footer_button');
    $('#bottom_nav_people').removeClass('active_footer_button');
    $('#bottom_nav_photos').addClass('active_footer_button');

    //If the view div doesn't exist, make it!
    if ($('#photos_index_view').length == 0) {
      $.ui.add_content_div('photos_index_view', $.template('views/photos/photos_index_view.js'), 'Photos');
    }
    //Show the view
    $.ui.load_content('photos_index_view', false, false, 'none');

  },

  detail: function (photo_id, comment) {

    //If the view div doesn't exist, make it!
    if ($('#photos_index_view').length == 0) {
      $.ui.add_content_div('photos_index_view', $.template('views/photos/photos_index_view.js'), 'Photos');
    }
    //Show the view
    $.ui.load_content('photos_index_view', false, false, 'fade');

  },

  take_photo: function() {
    forge.file.getImage();
  }
});

