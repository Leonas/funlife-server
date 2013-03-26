/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('photos_controller', {
  init: function () {


  },

  default: function () {

    $.ui.show_page({
      div_id: 'photos_index_view',
      title: 'Photos',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_photos',
      api_url: false,
      data: false
    });

  },

  detail: function (photo_id, comment) {

    $.ui.show_page({
      div_id: 'photo_detail_view',
      title: 'Photo',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_photos',
      api_url: false,
      data: false
    });

  },

  take_photo: function() {
    if(typeof forge === 'undefined'){
      alert('Only works on phones');
    }
    else {
      forge.file.getImage();
    }

  }
});

