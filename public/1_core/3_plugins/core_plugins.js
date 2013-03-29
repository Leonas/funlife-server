//var global = {
//  current_nav_id: '',
//  last_click: '',
//  cached_pages: []
//};
//
////Before finishing up this page, check out more of the jqUI code
//
//
//(function($){
//
//  $.set_active_nav = function set_active_nav(div_id){
//    $(global.current_nav_id).removeClass('active_footer_button');
//    $(div_id).addClass('active_footer_button');
//    global.current_nav_id = div_id;
//  };
//
//
//
//  $.show_page = function show_page(options){
//
//    if (options.active_nav && (options.active_nav != global.current_nav){
//      $.set_active_nav(options.active_nav);
//    }
//
//    //if there's a remote url we need to get go here
//    if(options.url){
//      //if we have a local cache of the page, use it first
//      if ( global.cached_pages[options.div_id] ) {
//        load page with it
//          do ajax request (on success, update contents)
//      }
//      else {
//        //load spinner while we get the data
//        //TODO loadspinner
//        $.get_with_token({
//          url: options.url,
//          data: options.data,
//          success: function(){
//
//          },
//          error: function(){
//
//          }
//      });
//      }
//    }
//
//
//    //else {
//    //    load spinner
//    //    ajax request(on success, remove spinner + load content)
//    //}
//
//
//    if ($('#' + options.div_id).length == 0) {
//      $.ui.add_content_div(options.div_id,
//          $.template(options.template), options.title, options.data);
//    }
//    //otherwise, update the content inside
//    else {
//      $.ui.update_content_div(options.div_id, $.template(options.template), options.data);
//    }
//    //trigger the page transition/navigation event
//    //These 4 things are ____??? Get from the API
//    $.ui.load_content('user_index_view', false, false, 'fade');
//
//
//
//    if
//
//    title: 'FunLife',
//        active_nav: '#bottom_nav_home',
//        div_id: 'user_index_view',
//        template: 'views/users/user_index_view.js',
//        left_button: true,
//        url: '/users/',
//        data: {}
//
//
//  };
//
//
//
//  $.get_with_token = function get_with_token(options, data){
//
//  };
//
//
//  $.post_with_token = function post_with_token(options){
//
//  };
//
//
//})(jq);
