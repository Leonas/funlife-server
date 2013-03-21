(function($){



 /*
  $.ui.show_page({
  header: id_of_header or null
  footer: tab_id or null
  left_button: id_of_left_button_div or null
  right_button: id_of_right_button_div or null
  title: 'FunLife',
  active_nav: '#bottom_nav_home',
  div_id: 'user_index_view',
  template: 'views/users/user_index_view.js',
  api_url: '/users/',
  data: false
  on_load: function(){}
  on_unload: function(){}
  scrolling: true, js scrolling is by phone data
  })
  */

  $.ui.show_page = function show_page(options){

    //execute the previous panel's unload function
    //someone passed a panel saying kill after 3 shows
    $.ui.unload();

    this.set_active_footer_button(options.active_nav);

    //if there's a remote url we need to get go here
    if(options.api_url){
      //if we have a local cache of the page, use it first
      if ( global.cached_pages[options.div_id] ) {
//        load page with it
//          do ajax request (on success, update contents)
      }
      else {
        //load spinner while we get the data
        //TODO loadspinner
        $.get_with_token({
          api_url: options.api_url,
          data: options.data,
          success: function(){

          },
          error: function(){

          }
        });
      }
    }


    //else {
    //    load spinner
    //    ajax request(on success, remove spinner + load content)
    //}


    if ($('#' + options.div_id).length == 0) {
      $.ui.add_content_div(options.div_id,
          $.template(options.template), options.title, options.data);
    }
    //otherwise, update the content inside
    else {
      $.ui.update_content_div(options.div_id, $.template(options.template), options.data);
    }
    //trigger the page transition/navigation event
    //These 4 things are ____??? Get from the API
    $.ui.load_content('user_index_view', false, false, 'fade');


//        title: 'FunLife',
//        active_nav: '#bottom_nav_home',
//        div_id: 'user_index_view',
//        template: 'views/users/user_index_view.js',
//        left_button: true,
//        api_url: '/users/',
//        data: {}


  };



  $.get_with_token = function get_with_token(options, data){

  };


  $.post_with_token = function post_with_token(options){

  };


})(jq);
