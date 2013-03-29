/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('activities_controller', {

  init: function () {


  },

  default: function () {
    console.log('no default view for this');
  },

  new_step_1: function () {
    $.ui.show_page({
      div_id: 'activity_new1_view',
      title: 'New Activity',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: false,
      api_url: false,
      data: false
    });

      $('#calendar_button').mobiscroll().calendar({
        theme: 'default',
        display: 'modal',
        mode: 'scroller',
        controls: ['calendar']
      });
      $('#calendar_button').click(function(){
        $('#calendar_button').mobiscroll('show');
        return false;
      });
      $('#clear').click(function () {
        $('#demo').val('');
        return false;
      });



  },

  new_step_2: function () {

    $.ui.show_page({
      div_id: 'activity_new2_view',
      title: 'Invite Friends',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: false,
      api_url: /users/,
      data: false
    });
  },

  new_step_3: function () {

    $.ui.show_page({
      div_id: 'activity_new3_view',
      title: 'Extras',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: false,
      api_url: false,
      data: false
    });

  },

  activity_detail_info: function () {

    $.ui.show_page({
      div_id: 'activity_detail_info_view',
      title: 'Activity Info',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: false,
      api_url: false,
      data: false
    });

  },

  activity_detail_attending: function () {

    $.ui.show_page({
      div_id: 'activity_detail_attending_view',
      title: "Who's Going?",
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: false,
      api_url: false,
      data: false
    });
  },



  activity_detail_join: function () {

    $.ui.show_page({
      div_id: 'activity_detail_join_view',
      title: 'Join',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: false,
      api_url: false,
      data: false
    });

  }
});

