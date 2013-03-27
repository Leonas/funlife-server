(function ($) {

  var default_hash = window.location.hash;
  var previous_target = default_hash;

  var ui = function () {
    //Custom transitions can be added to $.ui.availableTransitions
    this.availableTransitions = {};
    this.availableTransitions['default'] = this.availableTransitions['none'] = this.noTransition;
  };


  ui.prototype = {
    //custom ui_kit stuff

    //stock element id's and class names
    header_id: '#header',
    footer_id: '#footer',
    content_id: '#content',
    panel_id: '#panel',
    side_menu_id: '#side_menu',   //wrong
    left_button_id: '#top_left_button',
    right_button_id: '#top_right_button',
    active_footer_button_id: '',
    active_footer_class: 'active_footer_button',
    title_id: '#title',
    ui_kit_container_id: '#ui_kit',
    starting_panel_id:   '#starting_panel',


    //These get grabbed right away so if you swap a header for a new one,
    //you can still go back to the old one later
    default_header_content: '',
    default_footer_content: '',
    default_side_menu_content: '',


    last_click: '',
    cached_pages: [],

    pages_created: 0,
    pages_in_dom: 0,
    delete_queue: {},
    on_unload: null,
    //queue is like delete_queue['17'] = [div_id, other_div_id]
    //when pages_created reaches 17, it will execute delete_queue['17']

    //end

    load_content_queue: [],
    footer: "",
    header: "",
    ui_kit_container: "",
    left_button: "",
    history: [],
    homeDiv: "",
    screen_width: "",
    content_string: "",
    modal_window: "",
    custom_footer: false,
    default_footer: "",
    default_header: null,
    custom_menu: false,
    default_menu: "",
    _readyFunc: null,
    doing_transition: false,
    password_box: $.password_box ? new $.password_box() : false,
    select_box: $.select_box ? $.select_box : false,
    ajax_url: "",
    transition_effect: "fade",
    scrolling_divs: [],
    firstDiv: "",
    has_launched: false,
    launch_completed: false,
    active_div: '',
    custom_click_handler: "",
    menu_animation: null,
    side_menu_displayed: false,
    show_footer_menu: true,
    auto_launch: true,
    showBackbutton: true,
    left_button_text: "Back",
    reset_scrollers: true,
    load_default_hash: true,
    useAjaxCacheBuster: false,    //add "&cache=_rand_" to any ajax loaded link

    autoBoot: function () {
      if (this.auto_launch) {
        this.launch();
      }
    },


    //=============================================================
    //                 Start Launch
    //=============================================================


    //Launches ui_kit.
    //If Auto_launch is set to true, it gets called on DOMContentLoaded.
    //If false, you must manually invoke it
    launch: function () {

      //Make sure it can't be launched more than once
      if (this.has_launched) {
        return;
      }
      this.has_launched = true;

      var that = this;
      //get all the main divs into variables
      this.ui_kit_container = $(this.ui_kit_container_id);
      this.footer = $(this.footer_id).get(0);
      this.content_string = $(this.content_id).get(0);
      this.header = $(this.header_id).get(0);
      this.left_button = $(this.left_button_id).get(0);
      this.right_button = $(this.right_button_id).get(0);
      this.menu = $(this.side_menu_id).get(0);


      //add a click listener to the #ui_kit div
      this.ui_kit_container[0].addEventListener('click', function (e) {
        console.log('click');
        $.ui.checkAnchorClick(e, e.target);
      }, false);


      this.os_specific_fixes();
      //=======================================================================================
      //setting up the header and back button



      $(document).on("click", ".back_button", function () {
        console.log('back clicked');
        that.go_back();
      });


        var starting_panel = $(this.starting_panel_id)[0];
        var tmp = starting_panel;
        var prevSibling = starting_panel.previousSibling;
        starting_panel.parentNode.removeChild(starting_panel);
        this.addDivAndScroll(tmp);
        $(this.starting_panel_id).insertAfter(prevSibling);
        this.firstDiv = $(this.starting_panel_id).get(0);

      starting_panel = null;


      if (this.firstDiv) {
        that = this;
        // Fix a bug in iOS where translate3d makes the content blurry
        this.active_div = this.firstDiv;
        if (this.scrolling_divs[this.active_div.id]) {
          this.scrolling_divs[this.active_div.id].enable();
        }

        var load_first_div = function () {
          //setup initial menu

            //TEMPORARY DISABLING. PLEASE FIX, THEN REENABLE
//          var firstMenu = $("nav").get();
//          if (firstMenu) {
//            that.default_menu = $(firstMenu).children().clone();
//            that.update_side_menu(that.default_menu);
//          }



          //get default header in case we need it later if you swap headers
          that.default_header = $("#header").children().clone();


          //go to active_div
          var firstPanelId = that.get_panel_id_from_hash(default_hash);
          //that.history=[{target:'#'+that.firstDiv.id}];   //set the first id as origin of path
          if (firstPanelId.length > 0 && that.load_default_hash && firstPanelId !== ("#" + that.firstDiv.id) && $(firstPanelId).length > 0) {
            that.load_content(default_hash, true, false, 'none'); //load the active page as a clear_history with no transition
          } else {
            previous_target = "#" + that.firstDiv.id;
            that.loadContentData(that.firstDiv); //load the info off the first panel

            that.firstDiv.style.display = "block";
            $("#header #left_button").css("visibility", "hidden");
          }

          that.launch_completed = true;

          //trigger ui ready
          $(document).trigger("$.ui.ready");
          //trigger moved to after current_user is loaded
          //remove splash screen
        };

          load_first_div();

      }
      that = this;
      $.bind(that, "content-loaded", function () {
        if (that.load_content_queue.length > 0) {
          var tmp = that.load_content_queue.splice(0, 1)[0];
          that.load_content(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4]);
        }
      });
      if (window.navigator.standalone) {
        this.blockPageScroll();
      }
      this.topClickScroll();

    },


    //=============================================================
    //                 End Launch
    //=============================================================


    toggle_visibility: function (element_id, visible) {
      if (visible === true) {
        $(element_id).show();
        return;
      }
      else if (visible === false) {
        $(element_id).hide();
        return;
      }
      $(element_id).toggle();
    },

    dispose: function (element_id) {
      //replace all images with src='tiny.png'
      //removeChild
    },

    //The ID of the original element never changes as the new
    //elements children replace the children of the original element
    set_element: function set_element(old_div, new_div) {
      if (new_div && new_div !== old_div) {
        old_div = $(old_div);
        old_div.html($(new_div).html());
        old_div.children().show();
      }
      else if(new_div === old_div){
        $(old_div).children().show();
      }
      else if(!new_div) {
        $(old_div).children().hide();
      }
    },

    set_active_footer_button: function (div_id) {
      //this has to be a search by id for best speed
      $(this.current_footer_button_id).removeClass(this.active_footer_class);
      $(div_id).addClass(this.active_footer_class);
      this.current_footer_button_id = div_id;
      //$(div_id).addClass(this.active_footer_class).siblings().removeClass(this.active_footer_class);

    },
/*
    set_footer: function (div_id) {
        console.log('div_id %s', div_id);
      if(div_id){
        this.set_element(this.footer_id, div_id);
        this.footer_id = div_id;
        this.toggle_footer_menu(true);
      }
      else{
        this.toggle_footer_menu(false);
      }
    },

*/

    set_footer: function (div_id) {
        if(div_id){
            $(this.footer_id).hide();
            this.footer_id = div_id;
            $(div_id).show();
        }
        else {
            $(this.footer_id).hide();
        }
    },
    
    
    
    toggle_footer_menu: function (force) {
      if ($(this.footer_id).css("display") !== "none" && ((force !== undefined && force !== true) || force === undefined)) {
        $("#content").css("bottom", "0px");
        $(this.footer_id).hide();
      }
      else if (force === undefined || (force !== undefined && force === true)) {
        $(this.footer_id).show();
        $("#content").css("bottom", $(this.footer_id).css("height"));
      }
    },


    set_header: function (div_id) {
    if(div_id){
      this.set_element(this.header_id, div_id);
      this.toggle_header_menu(true);
    }
    else{
      this.toggle_header_menu(false);
}
    },

    toggle_header_menu: function (force) {
      if ($("#header").css("display") !== "none" && ((force !== undefined && force !== true) || force === undefined)) {
//        $("#content").css("top", "0px");
        $("#header").hide();
      }
      else if (force === undefined || (force !== undefined && force === true)) {
        $(this.header_id).show();
//        var val = numOnly($(this.header_id).css("height"));
//        $(this.content_id).css("top", val + 'px');
      }
    },


    set_left_button: function (div_id) {
      this.set_element(this.left_button_id, div_id);
    },

    set_right_button: function (div_id) {
      this.set_element(this.right_button_id, div_id);
    },


    os_specific_fixes: function () {

      var that = this;
      //enter-edit scroll padding fix
      //focus scroll adjust fix
      var enterEditEl = null;
      //on enter-edit keep a reference of the actioned element
      $.bind($.touch_layer, 'enter-edit', function (element) {
        enterEditEl = element;
      });
      //enter-edit-reshape panel padding and scroll adjust
      $.bind($.touch_layer, 'enter-edit-reshape', function () {
        //onReshape UI fixes
        //check if focused element is within active panel
        var jQel = $(enterEditEl);
        var jQactive = jQel.closest(that.active_div);
        if (jQactive && jQactive.size() > 0) {
          if ($.os.ios || $.os.chrome) {
            var paddingTop, paddingBottom;
            if (document.body.scrollTop) {
              paddingTop = document.body.scrollTop - jQactive.offset().top;
            } else {
              paddingTop = 0;
            }
            //not exact, can be a little above the actual value
            //but we haven't found an accurate way to measure it and this is the best so far
            paddingBottom = jQactive.offset().bottom - jQel.offset().bottom;
            that.scrolling_divs[that.active_div.id].setPaddings(paddingTop, paddingBottom);

          } else if ($.os.android || $.os.blackberry) {
            var elPos = jQel.offset();
            var containerPos = jQactive.offset();
            if (elPos.bottom > containerPos.bottom && elPos.height < containerPos.height) {
              //apply fix
              that.scrolling_divs[that.active_div.id].scrollToItem(jQel, 'bottom');
            }
          }
        }
      });

      if ($.os.ios) {
        $.bind($.touch_layer, 'exit-edit-reshape', function () {
          that.scrolling_divs[that.active_div.id].setPaddings(0, 0);
        });
      }
    },

    css3animate: function (element, options) {
      element = $(element);
      return element.css3Animate(options);
    },

    actionsheet: function (options) {
      return $("#ui_kit").actionsheet(options);
    },

    popup: function (options) {
      return $("#ui_kit").popup(options);
    },

    // function to fire when jqUi is ready and completed launch
    ready: function (param) {
      if (this.launch_completed){

        param();
      }
      else{
        document.addEventListener("$.ui.ready", function (e) {
          param();
          this.removeEventListener('$.ui.ready', arguments.callee);
        }, false);
      }
    },


    go_back: function () {
      if (this.history.length > 0) {
        this.history.pop();                        //remove the current page
        var previous_page = this.history.pop();    //get the previous page
        $.mvc.route(previous_page);
      }
    },

    clear_history: function () {
      this.history = [];
    },

    get_panel_id_from_hash: function (hash) {
      var firstSlash = hash.indexOf('/');
      return firstSlash === -1 ? hash : hash.substring(0, firstSlash);
    },



    update_content_div: function (id, content_string) {
      id = "#" + id.replace("#", "");
      var element = $(id).get(0);
      if (!element){
        return;
      }
      var newDiv = document.createElement("div");
      newDiv.innerHTML = content_string;
      //$(newDiv).children('.panel') doesnt seem to be right. test it
      //debugger;
      if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0){
        newDiv = $(newDiv).children('.panel').get();
      }


      if (element.getAttribute("js-scrolling") && element.getAttribute("js-scrolling").toLowerCase() === "yes") {
        $.cleanUpContent(element.childNodes[0], false, true);
        element.childNodes[0].innerHTML = content_string;
      }
      else {
        $.cleanUpContent(element, false, true);
        element.innerHTML = content_string;
      }
      if ($(newDiv).title){
        element.title = $(newDiv).title;
      }
    },

    //Dynamically create a new panel on the fly.  It wires events, creates the scroller, applies Android fixes, etc.
    add_content_div: function (element, content_string, title, refresh) {
      element = typeof (element) !== "string" ? element : element.indexOf("#") === -1 ? "#" + element : element;
      var myEl = $(element).get(0);
      var newDiv, newId;
      if (!myEl) {
        newDiv = document.createElement("div");
        newDiv.innerHTML = content_string;
        if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0){
          newDiv = $(newDiv).children('.panel').get();
        }
        if (!newDiv.title && title){
          //debugger;
          newDiv.title = title;
        }
        newId = (newDiv.id) ? newDiv.id : element.replace("#", ""); //figure out the new id - either the id from the loaded div.panel or the crc32 hash
        newDiv.id = newId;
      }
      else {
        newDiv = myEl;
      }
      newDiv.className = "panel";
      newId = newDiv.id;
      this.addDivAndScroll(newDiv, refresh);
      myEl = null;
      newDiv = null;
      return newId;
    },


    //This is called to initiate a transition
    //We can pass in a hash+id or URL and then we parse the panel for additional functions
    //clear_history = true = resetHistory, back = true = back click
    load_content: function (target, clear_history, back, transition, anchor) {

      if (this.doing_transition) {
        this.load_content_queue.push([target, clear_history, back, transition, anchor]);
      }
      else if (target.length === 0) {
      return;
      }
      else {
        this.loadDiv(target, clear_history, back, transition);
      }
    },

    //This is called internally by load_content.  Here we are loading a div instead of an Ajax link
    loadDiv: function (new_panel_id, clear_history, back, transition) {

      //replace any # to prevent browser issues
      new_panel_id = new_panel_id.replace("#", "");
      var slashIndex = new_panel_id.indexOf('/');
      if (slashIndex !== -1) {
        // Ignore everything after the slash for loading
        new_panel_id = new_panel_id.substr(0, slashIndex);
      }

      var new_panel = $('#' + new_panel_id).get(0);

      if (!new_panel) {
        return console.log("Target panel: " + new_panel_id + " was not found");
      }
      this.transition_effect = transition;
      var current_panel = this.active_div;


      if (current_panel === new_panel){ //prevent it from going to itself
        return;
      }
      if (clear_history) {
        this.clear_history();
      }

      this.doing_transition = true;

      current_panel.style.display = "block";
      new_panel.style.display = "block";

      this.runTransition(transition, current_panel, new_panel, back);

      //Let's check if it has a function to run to update the data
      //this.parsePanelFunctions(what, current_panel);

      //Need to call after parsePanelFunctions, since new headers can override
      this.loadContentData(new_panel);
      var that = this;
      setTimeout(function () {
        if (that.scrolling_divs[current_panel.id]) {
          that.scrolling_divs[current_panel.id].disable();
        }
      }, 200);

    },

    //This is called internally by loadDiv.  This sets up the back button
    // in the header and scroller for the panel
    loadContentData: function (new_panel) {
      if (new_panel.title) {
        $(this.title_id).html(new_panel.title);
      }
      this.active_div = new_panel;
      if (this.scrolling_divs[this.active_div.id]) {
        this.scrolling_divs[this.active_div.id].enable(this.reset_scrollers);
      }

    },

    runTransition: function (transition, current_panel, new_panel, back) {
      if (!this.availableTransitions[transition]){
        transition = 'default';
      }
      this.availableTransitions[transition].call(this, current_panel, new_panel, back);
    },


    //sets up scrolling for a div
    addDivAndScroll: function (tmp, refreshPull) {
      var jsScroll = false;
      var scrollEl;
      var overflowStyle = tmp.style.overflow;
      var hasScroll = overflowStyle !== 'hidden' && overflowStyle !== 'visible';
      var container = this.content_string;
      //sets up scroll when required and not supported
      if (!$.feat.nativeTouchScroll && hasScroll) {
        tmp.setAttribute("js-scrolling", "yes");
      }
      if (tmp.getAttribute("js-scrolling") && tmp.getAttribute("js-scrolling").toLowerCase() === "yes") {
        jsScroll = true;
        hasScroll = true;
      }
      if (tmp.getAttribute("scrolling") && tmp.getAttribute("scrolling") === 'no') {
        hasScroll = false;
        jsScroll = false;
        tmp.removeAttribute("js-scrolling");
      }
      if (!jsScroll) {
        container.appendChild(tmp);
        scrollEl = tmp;
        tmp.style['-webkit-overflow-scrolling'] = 'none';
      }
      else {
        //WE need to clone the div so we keep events
        scrollEl = tmp.cloneNode(false);
        tmp.title = null;
        tmp.id = null;
        $(tmp).replaceClass("panel", "jqmScrollPanel");
        scrollEl.appendChild(tmp);
        container.appendChild(scrollEl);
        if (this.select_box !== false) {
          this.select_box.getOldSelects(scrollEl.id);
        }
        if (this.password_box !== false) {
          this.password_box.getOldPasswords(scrollEl.id);
        }
      }
      if (hasScroll) {
        this.scrolling_divs[scrollEl.id] = ($(tmp).scroller({
          scrollBars: true,
          verticalScroll: true,
          horizontalScroll: false,
          vScrollCSS: "jqmScrollbar",
          refresh: refreshPull,
          useJsScroll: jsScroll,
          noParent: !jsScroll,
          autoEnable: false //dont enable the events unnecessarily
        }));
      }
      tmp = null;
      scrollEl = null;
    },

    scrollToTop: function (id) {
      if (this.scrolling_divs[id]) {
        this.scrolling_divs[id].scrollToTop("300ms");
      }
    },

    scrollToBottom: function (id) {
      if (this.scrolling_divs[id]) {
        this.scrolling_divs[id].scrollToBottom("300ms");
      }
    },

    //Simulates the click and scroll to top of browser
    topClickScroll: function () {
      document.getElementById("header").addEventListener("click", function (e) {
        if (e.clientY <= 15 && e.target.nodeName.toLowerCase() === "h1"){ //hack - the title spans the whole width of the header
          $.ui.scrolling_divs[$.ui.active_div.id].scrollToTop("100");
        }
      });
    },

    blockPageScroll: function () {
      $("#ui_kit #header").bind("touchmove", function (e) {
        e.preventDefault();
      });
    },

    //This is the default transition.  It simply shows the new panel and hides the old
    noTransition: function (current_panel, new_panel) {
      new_panel.style.display = "block";
      current_panel.style.display = "block";
      var that = this;
      that.clearAnimations(new_panel);
      that.css3animate(current_panel, {
        x: "0%",
        y: 0
      });
      that.finishTransition(current_panel);
      new_panel.style.zIndex = 2;
      current_panel.style.zIndex = 1;
    },

    //This must be called at the end of every transition to hide the old div and
    // reset the doing_transition variable
    finishTransition: function (current_panel, new_panel) {
      current_panel.style.display = 'none';
      this.doing_transition = false;
      if (new_panel){
        this.clearAnimations(new_panel);
      }
      if (current_panel){
        this.clearAnimations(current_panel);
      }
      $.trigger(this, "content-loaded");
    },

    //Must be called at the end of every transition for performance and native scroll
    clearAnimations: function (in_view_div_object) {
      in_view_div_object.style[$.feat.cssPrefix + 'Transform'] = "none";
      in_view_div_object.style[$.feat.cssPrefix + 'Transition'] = "none";
    }
  };


  $.ui = new ui();
})(jq);




