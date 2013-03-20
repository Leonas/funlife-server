(function ($) {

  var has_launched = false;
  var start_path = window.location.pathname;
  var default_hash = window.location.hash;
  var previous_target = default_hash;
  var ui = function () {

    var this_ui = this;

    //when doc ready, add the touch layer
    jq(document).ready(function () {
      if (jq.os.supportsTouch){
        $.touch_layer(document.getElementById("ui_kit"));
      }
    });


    //If the document is ready, call autoBoot to launch
    if (document.readyState == "complete" || document.readyState == "loaded") {
      this.autoBoot();
    }
    //Otherwise add a listener and launch when ready
    else {
      document.addEventListener("DOMContentLoaded", function () {
        this_ui.autoBoot();
        this.removeEventListener("DOMContentLoaded", arguments.callee);
      }, false);
    }


    //popstate event is fired when the active history entry changes
    //this will tell us if back button was clicked
//    window.addEventListener("popstate", function () {
//      var current_panel_id = $.ui.get_panel_id_from_hash(document.location.hash);
//
//      if (current_panel_id == "" && $.ui.history.length === 1) {
//        alert('this happens once');
//        current_panel_id = "#" + $.ui.firstDiv.id;
//      }
//      if (current_panel_id == ""){
//        return;
//      }
//      else if (document.querySelectorAll(current_panel_id + ".panel").length === 0){
//        return;
//      }
//      else if (current_panel_id != "#" + $.ui.active_div.id) {
//        this_ui.go_back();
//      }
//    }, false);

    window.addEventListener("unloadpanel", function () {
      console.log('unload requested but should be handled differently');
    }, false);


    //Custom transitions can be added to $.ui.availableTransitions
    this.availableTransitions = {};
    this.availableTransitions['default'] = this.availableTransitions['none'] = this.noTransition;
  };


  ui.prototype = {
    load_content_queue: [],
    navbar: "",
    header: "",
    viewport_container: "",
    backButton: "",
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
    password_box: jq.password_box ? new jq.password_box() : false,
    select_box: jq.select_box ? jq.select_box : false,
    ajax_url: "",
    transition_effect: "fade",
    scrolling_divs: [],
    firstDiv: "",
    has_launched: false,
    launch_completed: false,
    active_div: "",
    custom_click_handler: "",
    menu_animation: null,
    side_menu_displayed: false,
    show_footer_menu: true,
    auto_launch: true,
    showBackbutton: true,
    back_button_text: "Back",
    reset_scrollers: true,
    load_default_hash: true,
    useAjaxCacheBuster: false,    //add "&cache=_rand_" to any ajax loaded link

    autoBoot: function () {
      if (this.auto_launch) {
        this.has_launched = true;
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

      //I've been launched already, set has_launched to true and return
      if (this.has_launched == false || this.launch_completed) {
        this.has_launched = true;
        return;
      }

      var that = this;


      this.viewport_container = jq("#ui_kit");
      this.navbar = jq("#navbar").get(0);
      this.content_string = jq("#content").get(0);
      this.header = jq("#header").get(0);
      this.menu = jq("#menu").get(0);
      //set anchor click handler for UI
      this.viewport_container[0].addEventListener('click', function (e) {
        var theTarget = e.target;
        checkAnchorClick(e, theTarget);
      }, false);


      //enter-edit scroll paddings fix
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



      //If there is no navbar, make one
      if (!this.navbar) {
        this.navbar = document.createElement("div");
        this.navbar.id = "navbar";
        this.navbar.style.cssText = "display:none";
        this.viewport_container.append(this.navbar);
      }


      //If there is no header, make one
      if (!this.header) {
        this.header = document.createElement("div");
        this.header.id = "header";
        this.viewport_container.prepend(this.header);
      }


      //If there is no menu, make one
      if (!this.menu) {
        this.menu = document.createElement("div");
        this.menu.id = "menu";
        this.menu.innerHTML = '<div id="menu_scroller"></div>';
        this.viewport_container.append(this.menu);
        this.menu.style.overflow = "hidden";
        this.scrolling_divs["menu_scroller"] = jq("#menu_scroller").scroller({
          scrollBars: true,
          verticalScroll: true,
          vScrollCSS: "jqmScrollbar",
          useJsScroll: !$.feat.nativeTouchScroll,
          noParent: $.feat.nativeTouchScroll
        });
        if ($.feat.nativeTouchScroll)
          $("#menu_scroller").css("height", "100%");
      }


      if (!this.content_string) {
        this.content_string = document.createElement("div");
        this.content_string.id = "content";
        this.viewport_container.append(this.content_string);
      }


      //=======================================================================================
      //setting up the header and back button

      this.header.innerHTML = header.innerHTML;

      this.backButton = $("#header #backButton").get(0);

      jq(document).on("click", "#header #backButton", function () {
        that.go_back();
      });


      this.add_content_div("first_div_here", "this is the first panel to load");


      //Make the loading mask Div in the background
      var maskDiv = document.createElement("div");
      maskDiv.id = "jQui_mask";
      maskDiv.className = "ui-loader";
      maskDiv.innerHTML = "<span class='ui-icon ui-icon-loading spin'></span><h1>Loading Content</h1>";
      maskDiv.style.zIndex = 20000;
      maskDiv.style.display = "none";
      document.body.appendChild(maskDiv);



      //Setup the modalDiv in the background
      var modalDiv = document.createElement("div");
      modalDiv.id = "modal_ui";
      this.viewport_container.prepend(modalDiv);
      modalDiv.appendChild(jq("<div id='modalContainer'></div>").get());
      this.scrolling_divs['modal_container'] = jq("#modalContainer").scroller({
        scrollBars: true,
        vertical: true,
        vScrollCSS: "jqmScrollbar",
        noParent: true
      });
      this.modal_window = modalDiv;



      //get first div, defer
      var defer = {};
      var contentDivs = this.viewport_container.get().querySelectorAll(".panel");
      for (var i = 0; i < contentDivs.length; i++) {
        var element = contentDivs[i];
        var tmp = element;
        var id;
        var prevSibling = element.previousSibling;
        if (element.parentNode && element.parentNode.id != "content") {

          element.parentNode.removeChild(element);
          id = element.id;
          if (tmp.getAttribute("selected"))
            this.firstDiv = jq("#" + id).get(0);
          this.addDivAndScroll(tmp);
          jq("#" + id).insertAfter(prevSibling);
        } else if (!element.parsedContent) {
          element.parsedContent = 1;
          element.parentNode.removeChild(element);
          id = element.id;
          if (tmp.getAttribute("selected"))
            this.firstDiv = jq("#" + id).get(0);
          this.addDivAndScroll(tmp);
          jq("#" + id).insertAfter(prevSibling);
        }
        if (element.getAttribute("data-defer")) {
          defer[id] = element.getAttribute("data-defer");
        }
        if (!this.firstDiv)
          this.firstDiv = $("#" + id).get(0);

        element = null;
      }
      contentDivs = null;
      var loadingDefer = false;
      var toLoad = Object.keys(defer).length;
      if (toLoad > 0) {
        loadingDefer = true;
        var loaded = 0;
        for (var j in defer) {
          (function (j) {
            jq.ajax({
              url: server + defer[j],
              success: function (data) {
                if (data.length == 0)
                  return;
                $.ui.update_content_div(j, data);
                that.parseScriptTags(jq(j).get());
                loaded++;
                if (loaded >= toLoad) {
                  $(document).trigger("defer:loaded");
                  loadingDefer = false;

                }
              },
              error: function (msg) {
                //still trigger the file as being loaded to not block jq.ui.ready
                console.log("Error with deferred load " + server + defer[j])
                loaded++;
                if (loaded >= toLoad) {
                  $(document).trigger("defer:loaded");
                  loadingDefer = false;
                }
              }
            });
          })(j);
        }
      }
      if (this.firstDiv) {

        var that = this;
        // Fix a bug in iOS where translate3d makes the content blurry
        this.active_div = this.firstDiv;

        if (this.scrolling_divs[this.active_div.id]) {
          this.scrolling_divs[this.active_div.id].enable();
        }

        //window.setTimeout(function() {
        var load_first_div = function () {


          if (jq("#navbar a").length > 0) {
            jq("#navbar a").data("ignore-pressed", "true").data("resetHistory", "true");
            that.default_footer = jq("#navbar").children().clone();
            that.update_footer_elements(that.default_footer);
          }
          //setup initial menu
          var firstMenu = jq("nav").get();
          if (firstMenu) {
            that.default_menu = jq(firstMenu).children().clone();
            that.update_side_menu(that.default_menu);
          }
          //get default header
          that.default_header = jq("#header").children().clone();
          //
          jq("#navbar").on("click", "a", function (e) {
            jq("#navbar a").not(this).removeClass("selected");
            $(e.target).addClass("selected");
          });


          //go to active_div
          var firstPanelId = that.get_panel_id_from_hash(default_hash);
          //that.history=[{target:'#'+that.firstDiv.id}];   //set the first id as origin of path
          if (firstPanelId.length > 0 && that.load_default_hash && firstPanelId != ("#" + that.firstDiv.id) && $(firstPanelId).length > 0) {
            that.load_content(default_hash, true, false, 'none'); //load the active page as a newTab with no transition
          } else {
            previous_target = "#" + that.firstDiv.id;
            that.loadContentData(that.firstDiv); //load the info off the first panel
            that.parsePanelFunctions(that.firstDiv);

            that.firstDiv.style.display = "block";
            $("#header #backButton").css("visibility", "hidden");
            if (that.firstDiv.getAttribute("data-modal") == "true" || that.firstDiv.getAttribute("modal") == "true") {
              that.show_modal(that.firstDiv.id);
            }
          }

          that.launch_completed = true;
          if (jq("nav").length > 0) {
            jq("#ui_kit #header").addClass("hasMenu off");
            jq("#ui_kit #content").addClass("hasMenu off");
            jq("#ui_kit #navbar").addClass("hasMenu off");
          }
          //trigger ui ready
          jq(document).trigger("jq.ui.ready");
          //remove splash screen

          // Run after the first div animation has been triggered - avoids flashing
          jq("#splashscreen").remove();
        };
        if (loadingDefer) {
          $(document).one("defer:loaded", load_first_div);
        } else
          load_first_div();
      }
      var that = this;
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







    css3animate: function (element, options) {
      element = jq(element);
      return element.css3Animate(options);
    },

    actionsheet: function (options) {
      return jq("#ui_kit").actionsheet(options);
    },

    popup: function (options) {
      return $("#ui_kit").popup(options);
    },

    // function to fire when jqUi is ready and completed launch
    ready: function (param) {
      if (this.launch_completed)
        param();
      else
        document.addEventListener("jq.ui.ready", function (e) {
          param();
          this.removeEventListener('jq.ui.ready', arguments.callee);
        }, false);
    },

    set_back_button_style: function (className) {
      jq("#backButton").get(0).className = className;
    },

    go_back: function () {
      if (this.history.length > 0) {
        var previous_page = this.history.pop();
        this.load_content(previous_page.target + "", false, true, previous_page.transition);
        this.transition_effect = previous_page.transition;
        this.update_url_hash(previous_page.target);
      }
    },

    clear_history: function () {
      this.history = [];
      this.set_back_button_visibility(false)
    },

    pushHistory: function (previous_page, new_page, transition, hash_extras) {
      //push into local history
      this.history.push({
        target: previous_page,
        transition: transition
      });
      //push into the browser history
      try {
        window.history.pushState(new_page, new_page, start_path + '#' + new_page + hash_extras);
        $(window).trigger('hashchange', {
          newUrl: start_path + '#' + new_page + hash_extras,
          oldURL: start_path + previous_page
        });
      }
      catch (e) {
      }
    },

    update_url_hash: function (new_hash) {

      //force having the # in the beginning as a standard
      new_hash = new_hash.indexOf('#') == -1 ? '#' + new_hash : new_hash;

      previous_target = new_hash;

      var previous_hash = window.location.hash;
      var panelName = this.get_panel_id_from_hash(new_hash).substring(1); //remove the #
      try {
        alert('panelName is not an object & convert this to url format');
        window.history.replaceState(panelName, panelName, start_path + new_hash);
        $(window).trigger('hashchange', {
          newUrl: start_path + new_hash,
          oldUrl: start_path + previous_hash
        });
      } catch (e) {
      }
    },

    get_panel_id_from_hash: function (hash) {
      var firstSlash = hash.indexOf('/');
      return firstSlash == -1 ? hash : hash.substring(0, firstSlash);
    },


    toggle_footer_menu: function (force) {
      if (!this.show_footer_menu)
        return;
      if (jq("#navbar").css("display") != "none" && ((force !== undefined && force !== true) || force === undefined)) {
        jq("#content").css("bottom", "0px");
        jq("#navbar").hide();
      } else if (force === undefined || (force !== undefined && force === true)) {
        jq("#navbar").show();
        jq("#content").css("bottom", jq("#navbar").css("height"));

      }
    },

    toggle_header_menu: function (force) {
      if (jq("#header").css("display") != "none" && ((force !== undefined && force !== true) || force === undefined)) {
        jq("#content").css("top", "0px");
        jq("#header").hide();
      } else if (force === undefined || (force !== undefined && force === true)) {
        jq("#header").show();
        var val = numOnly(jq("#header").css("height"));
        jq("#content").css("top", val + 'px');
      }
    },

    toggle_side_menu: function (force, callback) {
      if (!this.isSideMenuEnabled() || this.side_menu_displayed)
        return;
      this.side_menu_displayed = true;

      var that = this;
      var menu = jq("#menu");
      var elements = jq("#content, #menu, #header, #navbar");

      if (!(menu.hasClass("on") || menu.hasClass("to-on")) && ((force !== undefined && force !== false) || force === undefined)) {

        menu.show();
        that.css3animate(elements, {
          "removeClass": "to-off off on",
          "addClass": "to-on",
          complete: function (canceled) {
            if (!canceled) {
              that.css3animate(elements, {
                "removeClass": "to-off off to-on",
                "addClass": "on",
                time: 0,
                complete: function () {
                  that.side_menu_displayed = false;
                  if (callback)
                    callback(false);
                }
              });
            } else {
              that.side_menu_displayed = false;
              if (callback)
                callback(true);
            }
          }
        });

      } else if (force === undefined || (force !== undefined && force === false)) {


        that.css3animate(elements, {
          "removeClass": "on off to-on",
          "addClass": "to-off",
          complete: function (canceled) {
            if (!canceled) {
              that.css3animate(elements, {
                "removeClass": "to-off on to-on",
                "addClass": "off",
                time: 0,
                complete: function () {
                  menu.hide();
                  that.side_menu_displayed = false;
                  if (callback)
                    callback(false);
                }
              });
            } else {
              that.side_menu_displayed = false;
              if (callback)
                callback(true);
            }
          }
        });
      }
    },

    disableSideMenu: function () {
      var elements = jq("#content, #menu, #header, #navbar");
      if (this.isSideMenuOn()) {
        this.toggle_side_menu(false, function (canceled) {
          if (!canceled)
            elements.removeClass("hasMenu");
        });
      } else
        elements.removeClass("hasMenu");
    },

    enableSideMenu: function () {
      var elements = jq("#content, #menu, #header, #navbar");
      elements.addClass("hasMenu");
    },

    isSideMenuEnabled: function () {
      return jq("#content").hasClass("hasMenu");
    },

    isSideMenuOn: function () {
      var menu = jq('#menu');
      return this.isSideMenuEnabled() && (menu.hasClass("on") || menu.hasClass("to-on"));
    },

    //this needs to be thoroughly checked out so it can work for me
    update_footer_elements: function (elements) {
      var footer_nav = jq("#navbar");
      if (elements === undefined || elements == null)
        return;
      if (typeof (elements) == "string")
        return footer_nav.html(elements, true), null;
      footer_nav.html("");
      for (var i = 0; i < elements.length; i++) {
        var node = elements[i].cloneNode(true);
        footer_nav.append(node);
      }
      var tmpAnchors = jq("#navbar a");
      if (tmpAnchors.length > 0)
        tmpAnchors.data("ignore-pressed", "true").data("resetHistory", "true");
    },


    update_side_menu: function (elements) {
      var that = this;

      var side_menu_nav = jq("#menu_scroller");

      if (elements === undefined || elements == null)
        return;
      if (typeof (elements) == "string") {
        side_menu_nav.html(elements, true)
      }
      else {
        side_menu_nav.html('');
        var close = document.createElement("a");
        close.className = "closebutton jqMenuClose";
        close.href = "javascript:;"
        close.onclick = function () {
          that.toggle_side_menu(false);
        };
        side_menu_nav.append(close);
        var tmp = document.createElement("div");
        tmp.className = "jqMenuHeader";
        tmp.innerHTML = "Menu";
        side_menu_nav.append(tmp);
        for (var i = 0; i < elements.length; i++) {
          var node = elements[i].cloneNode(true);
          side_menu_nav.append(node);
        }
      }
      //Move the scroller to the top and hide it
      this.scrolling_divs['menu_scroller'].hideScrollbars();
      this.scrolling_divs['menu_scroller'].scrollToTop();
    },

    set_title: function (val) {
      jq("#header #pageTitle").html(val);
    },

    set_back_button_text: function (text) {
      if (this.back_button_text.length > 0)
        jq("#header #backButton").html(this.back_button_text);
      else
        jq("#header #backButton").html(text);
    },

    set_back_button_visibility: function (show) {
      if (!show)
        jq("#header #backButton").css("visibility", "hidden");
      else
        jq("#header #backButton").css("visibility", "visible");
    },

    show_modal: function (id) {
      var that = this;
      id = "#" + id.replace("#", "");
      try {
        if (jq(id)) {
          jq("#modalContainer").html($.feat.nativeTouchScroll ? jq(id).html() : jq(id).get(0).childNodes[0].innerHTML + '', true);
          jq('#modalContainer').append("<a href='javascript:;' onclick='$.ui.hide_modal();' class='closebutton modalbutton'></a>");
          this.modal_window.style.display = "block";

          this.scrolling_divs['modal_container'].enable(that.reset_scrollers);
          this.scrollToTop('modal');
          jq("#modalContainer").data("panel", id);
        }
      } catch (e) {
        console.log("Error with modal - " + e, this.modal_window);
      }
    },

    hide_modal: function () {
      var modal = $("#modalContainer");
      modal.html("", true);
      jq("#modal_ui").hide();

      this.scrolling_divs['modal_container'].disable();

      var tmp = $(modal.data("panel"));
      var fnc = tmp.data("unload");
      if (typeof fnc == "string" && window[fnc]) {
        window[fnc](tmp.get(0));
      }
      tmp.trigger("unloadpanel");

    },

    update_content_div: function (id, content_string) {
      console.log('update_content_div');
      id = "#" + id.replace("#", "");
      var element = jq(id).get(0);
      if (!element)
        return;

      var newDiv = document.createElement("div");
      newDiv.innerHTML = content_string;
      if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0)
        newDiv = $(newDiv).children('.panel').get();


      if (element.getAttribute("js-scrolling") && element.getAttribute("js-scrolling").toLowerCase() == "yes") {
        $.cleanUpContent(element.childNodes[0], false, true);
        element.childNodes[0].innerHTML = content_string;
      } else {
        $.cleanUpContent(element, false, true);
        element.innerHTML = content_string;
      }
      if ($(newDiv).title)
        element.title = $(newDiv).title;
    },

    //Dynamically create a new panel on the fly.  It wires events, creates the scroller, applies Android fixes, etc.
    add_content_div: function (element, content_string, title, refresh) {
      console.log('add_content_div');

      element = typeof (element) !== "string" ? element : element.indexOf("#") == -1 ? "#" + element : element;
      var myEl = jq(element).get(0);
      if (!myEl) {
        var newDiv = document.createElement("div");
        newDiv.innerHTML = content_string;
        if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0)
          newDiv = $(newDiv).children('.panel').get();

        if (!newDiv.title && title)
          newDiv.title = title;
        var newId = (newDiv.id) ? newDiv.id : element.replace("#", ""); //figure out the new id - either the id from the loaded div.panel or the crc32 hash
        newDiv.id = newId;
        if (newDiv.id != element)
          newDiv.setAttribute("data-crc", element.replace("#", ""));
      } else {
        newDiv = myEl;
      }
      newDiv.className = "panel";
      newId = newDiv.id;
      this.addDivAndScroll(newDiv, refresh);
      myEl = null;
      newDiv = null;
      return newId;
    },

    //sets up scrolling for a div
    addDivAndScroll: function (tmp, refreshPull) {

      var jsScroll = false;
      var overflowStyle = tmp.style.overflow;
      var hasScroll = overflowStyle != 'hidden' && overflowStyle != 'visible';

      var container = this.content_string;

      var js_scrolling = false;

      //sets up scroll when required and not supported
      if (!$.feat.nativeTouchScroll && hasScroll)
        js_scrolling = true;

      if (js_scrolling) {
        jsScroll = true;
        hasScroll = true;
      }


      if (tmp.getAttribute("scrolling") && tmp.getAttribute("scrolling") == "no") {
        hasScroll = false;
        jsScroll = false;
        js_scrolling = false;
      }

      if (!jsScroll) {
        container.appendChild(tmp);
        var scrollEl = tmp;
        tmp.style['-webkit-overflow-scrolling'] = "none"
      } else {





        //WE need to clone the div so we keep events
        var scrollEl = tmp.cloneNode(false);


        tmp.title = null;
        tmp.id = null;
        tmp.removeAttribute("data-footer");
        tmp.removeAttribute("data-nav");
        tmp.removeAttribute("data-header");
        tmp.removeAttribute("selected");
        tmp.removeAttribute("data-load");
        tmp.removeAttribute("data-unload");
        tmp.removeAttribute("data-tab");
        jq(tmp).replaceClass("panel", "jqmScrollPanel");

        scrollEl.appendChild(tmp);

        container.appendChild(scrollEl);

        if (this.select_box !== false)
          this.select_box.getOldSelects(scrollEl.id);
        if (this.password_box !== false)
          this.password_box.getOldPasswords(scrollEl.id);

      }

      if (hasScroll) {
        this.scrolling_divs[scrollEl.id] = (jq(tmp).scroller({
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


    //This is used when a transition fires to do helper events.
    // We check to see if we need to change the nav menus, footer, and fire
    //the load/onload functions for panels
    parsePanelFunctions: function (what, old_div) {
      //check for custom footer
      var that = this;
      var hasFooter = what.getAttribute("data-footer");
      var hasHeader = what.getAttribute("data-header");

      //$asap removed since animations are fixed in css3animate
      if (hasFooter && hasFooter.toLowerCase() == "none") {
        that.toggle_footer_menu(false);
      } else {
        that.toggle_footer_menu(true);
      }
      if (hasFooter && that.custom_footer != hasFooter) {
        that.custom_footer = hasFooter;
        that.update_footer_elements(jq("#" + hasFooter).children());
      } else if (hasFooter != that.custom_footer) {
        if (that.custom_footer)
          that.update_footer_elements(that.default_footer);
        that.custom_footer = false;
      }
      if (hasHeader && hasHeader.toLowerCase() == "none") {
        that.toggle_header_menu(false);
      } else {
        that.toggle_header_menu(true);
      }

      if (hasHeader && that.customHeader != hasHeader) {
        that.customHeader = hasHeader;
        that.update_header_elements(jq("#" + hasHeader).children());
      } else if (hasHeader != that.customHeader) {
        if (that.customHeader) {
          that.update_header_elements(that.default_header);
          that.set_title(that.active_div.title);
        }
        that.customHeader = false;
      }
      if (what.getAttribute("data-tab")) { //Allow the dev to force the footer menu
        jq("#navbar a").removeClass("selected");
        jq("#" + what.getAttribute("data-tab")).addClass("selected");
      }

      //Load inline footers
      var inlineFooters = $(what).find("footer");
      if (inlineFooters.length > 0) {
        that.custom_footer = what.id;
        that.update_footer_elements(inlineFooters.children());
      }
      //load inline headers
      var inlineHeader = $(what).find("header");


      if (inlineHeader.length > 0) {
        that.customHeader = what.id;
        that.update_header_elements(inlineHeader.children());
      }
      //check if the panel has a footer
      if (what.getAttribute("data-tab")) { //Allow the dev to force the footer menu
        jq("#navbar a").removeClass("selected");
        jq("#navbar #" + what.getAttribute("data-tab")).addClass("selected");
      }

      var hasMenu = what.getAttribute("data-nav");
      if (hasMenu && this.custom_menu != hasMenu) {
        this.custom_menu = hasMenu;
        this.update_side_menu(jq("#" + hasMenu).children());
      } else if (hasMenu != this.custom_menu) {
        if (this.custom_menu) {
          this.update_side_menu(this.default_menu);
        }
        this.custom_menu = false;
      }


      if (old_div) {
        fnc = old_div.getAttribute("data-unload");
        if (typeof fnc == "string" && window[fnc]) {
          window[fnc](old_div);
        }
        $(old_div).trigger("unloadpanel");
      }
      var fnc = what.getAttribute("data-load");
      if (typeof fnc == "string" && window[fnc]) {
        window[fnc](what);
      }
      $(what).trigger("loadpanel");
      if (this.isSideMenuOn()) {
        this.toggle_side_menu(false);
      }
    },

    //Helper function that parses a contents html for any script tags and either adds them or executes the code
    parseScriptTags: function (div) {
      if (!div)
        return;
      $.parseJS(div);
    },


    //This is called to initiate a transition
    //We can pass in a hash+id or URL and then we parse the panel for additional functions
    //newTab = true = resetHistory, back = true = back click
    load_content: function (target, newTab, back, transition, anchor) {

      if (this.doing_transition) {
        this.load_content_queue.push([target, newTab, back, transition, anchor]);
        return;
      }
      else if (target.length === 0) {
        return;
      }
      else {
        this.loadDiv(target, newTab, back, transition);
      }
    },

    //This is called internally by load_content.  Here we are loading a div instead of an Ajax link
    loadDiv: function (target, newTab, back, transition) {
      // load a div
      var what = target.replace("#", "");

      var slashIndex = what.indexOf('/');
      var hashLink = "";
      if (slashIndex != -1) {
        // Ignore everything after the slash for loading
        hashLink = what.substr(slashIndex);
        what = what.substr(0, slashIndex);
      }

      what = jq("#" + what).get(0);

      if (!what)
        return console.log("Target: " + target + " was not found");
      if (what == this.active_div && !back) {
        //toggle the menu if applicable
        if (this.isSideMenuOn())
          this.toggle_side_menu(false);
        return;
      }
      this.transition_effect = transition;
      var old_div = this.active_div;
      var currWhat = what;

      if (what.getAttribute("data-modal") == "true" || what.getAttribute("modal") == "true") {
        var fnc = what.getAttribute("data-load");
        if (typeof fnc == "string" && window[fnc]) {
          window[fnc](what);
        }
        $(what).trigger("loadpanel");
        return this.show_modal(what.id);
      }


      if (old_div == currWhat) //prevent it from going to itself
        return;

      if (newTab) {
        this.clear_history();
        this.pushHistory("#" + this.firstDiv.id, what.id, transition, hashLink);
      } else if (!back) {
        this.pushHistory(previous_target, what.id, transition, hashLink);
      }


      previous_target = '#' + what.id + hashLink;


      this.doing_transition = true;

      old_div.style.display = "block";
      currWhat.style.display = "block";

      this.runTransition(transition, old_div, currWhat, back);


      //Let's check if it has a function to run to update the data
      this.parsePanelFunctions(what, old_div);

      //Need to call after parsePanelFunctions, since new headers can override
      this.loadContentData(what, newTab, back);
      var that = this;
      setTimeout(function () {
        if (that.scrolling_divs[old_div.id]) {
          that.scrolling_divs[old_div.id].disable();
        }
      }, 200);

    },

    //This is called internally by loadDiv.  This sets up the back button
    // in the header and scroller for the panel
    loadContentData: function (what, newTab, back) {
      if (back) {
        if (this.history.length > 0) {
          var val = this.history[this.history.length - 1];
          var slashIndex = val.target.indexOf('/');
          if (slashIndex != -1) {
            var prevId = val.target.substr(0, slashIndex);
          } else
            var prevId = val.target;
          var element = jq(prevId).get(0);
          //make sure panel is there
          if (element)
            this.set_back_button_text(element.title);
          else
            this.set_back_button_text("Back");
        }
      } else if (this.active_div.title)
        this.set_back_button_text(this.active_div.title)
      else
        this.set_back_button_text("Back");
      if (what.title) {
        this.set_title(what.title);
      }
      if (newTab) {
        this.set_back_button_text(this.firstDiv.title)
      }

      if (this.history.length == 0) {
        this.set_back_button_visibility(false);
        this.history = [];
      } else if (this.showBackbutton)
        this.set_back_button_visibility(true);
      this.active_div = what;
      if (this.scrolling_divs[this.active_div.id]) {
        this.scrolling_divs[this.active_div.id].enable(this.reset_scrollers);
      }
    },

    runTransition: function (transition, old_div, current_div, back) {
      if (!this.availableTransitions[transition])
        transition = 'default';
      this.availableTransitions[transition].call(this, old_div, current_div, back);
    },



    //Simulates the click and scroll to top of browser
    topClickScroll: function () {
      document.getElementById("header").addEventListener("click", function (e) {
        if (e.clientY <= 15 && e.target.nodeName.toLowerCase() == "h1") //hack - the title spans the whole width of the header
          $.ui.scrolling_divs[$.ui.active_div.id].scrollToTop("100");
      });

    },

    blockPageScroll: function () {
      jq("#ui_kit #header").bind("touchmove", function (e) {
        e.preventDefault();
      });
    },

    //This is the default transition.  It simply shows the new panel and hides the old
    noTransition: function (old_div, current_div, back) {
      current_div.style.display = "block";
      old_div.style.display = "block";
      var that = this;
      that.clearAnimations(current_div);
      that.css3animate(old_div, {
        x: "0%",
        y: 0
      });
      that.finishTransition(old_div);
      current_div.style.zIndex = 2;
      old_div.style.zIndex = 1;
    },

    //This must be called at the end of every transition to hide the old div and
    // reset the doing_transition variable
    finishTransition: function (old_div, current_div) {
      console.log('$.ui.finishTransition(old_div, current_div)');
      console.log('old_div=' + old_div.title);


      //Its possible to destroy the old div from this point


//          console.log(old_div.title);
//          console.log(current_div.title);
      old_div.style.display = 'none';
      this.doing_transition = false;
      if (current_div)
        this.clearAnimations(current_div);
      if (old_div)
        this.clearAnimations(old_div);
      $.trigger(this, "content-loaded");
    },


    //Must be called at the end of every transition for performance and native scroll
    clearAnimations: function (in_view_div_object) {
      in_view_div_object.style[$.feat.cssPrefix + 'Transform'] = "none";
      in_view_div_object.style[$.feat.cssPrefix + 'Transition'] = "none";
    }


  };


  //lookup for a clicked anchor recursively and fire UI own actions when applicable
  var checkAnchorClick = function (e, theTarget) {
    console.log('checkAnchorClick is called');

    if (theTarget == (ui_kit)) {
      return;
    }

    //this technique fails when considerable content exists inside anchor, should be recursive ?
    if (theTarget.tagName.toLowerCase() != "a" && theTarget.parentNode)
      return checkAnchorClick(e, theTarget.parentNode); //let's try the parent (recursive)
    //anchors
    if (theTarget.tagName !== "undefined" && theTarget.tagName.toLowerCase() == "a") {

      var custom = (typeof jq.ui.custom_click_handler == "function") ? jq.ui.custom_click_handler : false;
      if (custom !== false) {
        if (jq.ui.custom_click_handler(theTarget))
          return e.preventDefault();

      }
      if (theTarget.href.toLowerCase().indexOf("javascript:") !== -1 || theTarget.getAttribute("data-ignore")) {
        return;
      }


      if (theTarget.href.indexOf("tel:") === 0)
        return false;

      //external links
      if (theTarget.hash.indexOf("#") === -1 && theTarget.target.length > 0) {
        if (theTarget.href.toLowerCase().indexOf("javascript:") != 0) {
          if (!jq.os.desktop) {
            e.target.target = "_blank";
          }
        }
        return;
      }

      /* IE 10 fixes*/

      var href = theTarget.href,
          prefix = location.protocol + "//" + location.hostname + ":" + location.port;
      if (href.indexOf(prefix) === 0) {
        href = href.substring(prefix.length + 1);
      }

      //empty links
      if (href == "#" || (href.indexOf("#") === href.length - 1) || (href.length == 0 && theTarget.hash.length == 0))
        return;

      //internal links
      e.preventDefault();
      var mytransition = theTarget.getAttribute("data-transition");
      var resetHistory = theTarget.getAttribute("data-resetHistory");
      resetHistory = resetHistory && resetHistory.toLowerCase() == "true" ? true : false;
      href = theTarget.hash.length > 0 ? theTarget.hash : theTarget.href;
      jq.ui.load_content(href, resetHistory, 0, mytransition, theTarget);

    }
  };

  $.ui = new ui;

})(jq);




