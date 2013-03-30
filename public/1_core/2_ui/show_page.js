(function ($) {



  /*
   $.ui.show_page({
   div_id: 'user_index_view',                               done
   title: 'FunLife',                                    done
   template: 'views/users/user_index_view.js',          done

   header: id_of_header or null                         done
   left_button: id_of_left_button_div or null           done
   right_button: id_of_right_button_div or null         done

   footer: tab_id or null                               done
   active_footer_button: '#bottom_nav_home',            done

   url: '/users/',                                  done
   data: 'data_to_be_sent_to_server'                    done
   on_load: function(){}                                BAD
   on_unload: function(){}                              done
   preload_urls: [url1, url2]                           NOTDONE
   cache: boolean                                       not done //default true
   })
   */

  $.ui.show_page = function show_page (options) {

    //execute the previous panel's unload
    if(this.on_unload) {
      this.on_unload();
      this.on_unload = null;
    }

    if(options.cache === undefined) {
      options.cache = true;
    }

    //set the unload function to this panel's on_unload
    if(options.on_unload) {
      this.unload = options.on_unload;
    }

    //TODO This needs to be moved into the area after the screen created, but before shown
    //execute the onload function
    if(options.on_load) {
      options.on_load();
    }

    this.set_header(options.header);
    this.set_footer(options.footer);
    this.set_active_footer_button(options.active_footer_button);
    this.set_left_button(options.left_button);
    this.set_right_button(options.right_button);

    //if we need to access remote data
    if(options.url) {
      //check if we have any cached data, and show that first
      if(options.cache && this.cached_pages[options.url] !== undefined) {
        console.log('we found cache');
        var parsed_data = JSON.parse(this.cached_pages[options.url]);
        $.ui.add_content_div(options.div_id, tmpl[options.div_id](parsed_data), options.title, this.cached_pages[options.div_id]);
        this.load_content(options.div_id, false, false, 'fade');
        $.get_with_token({
          url    : options.url,
          data   : options.data,
          success: function (response, statusText, xhr) {
            console.log('got new content...updating');
            var parsed_data = JSON.parse(response);
            var data = JSON.parse(response);
            $.ui.update_content_div(options.div_id, tmpl[options.div_id](parsed_data));
            if(options.cache) {
              $.ui.cached_pages[options.url] = response;
              $.ui.cached_pages.save();
            }
          },
          error  : function () {
            console.log('failed to update');
          }
        });
      }
      else {
        console.log('no local cache found or cache disabled');
        $.get_with_token({
          url    : options.url,
          data   : options.data,
          success: function (response, statusText, xhr) {
            var parsed_data = JSON.parse(response);
            console.log(parsed_data);
            $.ui.add_content_div(options.div_id, tmpl[options.div_id](parsed_data), options.title);
            $.ui.load_content(options.div_id, false, false, 'fade');
            if(options.cache) {
              console.log('setting first cache for this page');
              $.ui.cached_pages[options.url] = response;
              $.ui.cached_pages.save();
            }
          },
          error  : function (a, b) {
            console.log('failed to access api');
            console.log(a);
            console.log(b);
          }
        });
      }
    }
    //no remote data needed
    else {
      console.log('no remote data needed');
      if($('#' + options.div_id).length === 0) {
        $.ui.add_content_div(options.div_id, tmpl[options.div_id](options.data), options.title);
      }
      else {
        this.update_content_div(options.div_id, tmpl[options.div_id](options.data));
      }
      this.load_content(options.div_id, false, false, 'fade');
    }
  };

})(jq);
