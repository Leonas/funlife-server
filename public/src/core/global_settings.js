easy_funcs: {
  set_active_nav: function (div_id){

  },
  get_with_token: function(options){

  },
  show_page: function(options){


    $.set_active_nav('#bottom_nav_home');

    $.get_with_token('/users/', data);

    //click on page
    //if( localstorage for page present ) {
    // load page with it
    // do ajax request (on success, update contents)
    // }

    //else {
    //    load spinner
    //    ajax request(on success, remove spinner + load content)
    //}


    if ($('#' + options.div_id).length == 0) {
      $.ui.addContentDiv(options.div_id,
          $.template(options.template), options.title, options.data);
    }
    //otherwise, update the content inside
    else {
      $.ui.updateContentDiv(options.div_id, $.template(options.template), options.data);
    }
    //trigger the page transition/navigation event
    //These 4 things are ____??? Get from the API
    $.ui.loadContent('user_index_view', false, false, 'fade');
  }

},