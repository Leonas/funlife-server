(function ($) {

  $.ui.side_menu = {

    //If there is no menu, make one
    create_side_menu: function () {
      if(!this.menu) {
        this.menu = document.createElement("div");
        this.menu.id = "menu";
        this.menu.innerHTML = '<div id="menu_scroller"></div>';
        this.ui_kit_container.append(this.menu);
        this.menu.style.overflow = "hidden";
        this.scrolling_divs["menu_scroller"] = jq("#menu_scroller").scroller({
          scrollBars    : true,
          verticalScroll: true,
          vScrollCSS    : "jqmScrollbar",
          useJsScroll   : !$.feat.nativeTouchScroll,
          noParent      : $.feat.nativeTouchScroll
        });
        if($.feat.nativeTouchScroll) {
          $("#menu_scroller").css("height", "100%");
        }
      }
    },

    toggle_side_menu: function (force, callback) {
      this.side_menu_displayed = true;
      var that = this;
      var menu = jq("#menu");
      var elements = jq("#content, #menu, #header, #footer");

      if(!(menu.hasClass("on") || menu.hasClass("to-on")) &&
          ((force !== undefined && force !== false) || force === undefined)) {
        menu.show();
        that.css3animate(elements, {
          "removeClass": "to-off off on",
          "addClass"   : "to-on",
          complete     : function (canceled) {
            if(!canceled) {
              that.css3animate(elements, {
                "removeClass": "to-off off to-on",
                "addClass"   : "on",
                time         : 0,
                complete     : function () {
                  that.side_menu_displayed = false;
                  if(callback) {
                    callback(false);
                  }
                }
              });
            }
            else {
              that.side_menu_displayed = false;
              if(callback) {
                callback(true);
              }
            }
          }
        });

      }
      else if(force === undefined || (force !== undefined && force === false)) {

        that.css3animate(elements, {
          "removeClass": "on off to-on",
          "addClass"   : "to-off",
          complete     : function (canceled) {
            if(!canceled) {
              that.css3animate(elements, {
                "removeClass": "to-off on to-on",
                "addClass"   : "off",
                time         : 0,
                complete     : function () {
                  menu.hide();
                  that.side_menu_displayed = false;
                  if(callback) {
                    callback(false);
                  }
                }
              });
            }
            else {
              that.side_menu_displayed = false;
              if(callback) {
                callback(true);
              }
            }
          }
        });
      }
    },


    disableSideMenu: function () {
      var elements = jq("#content, #menu, #header, #footer");
      if(this.isSideMenuOn()) {
        this.toggle_side_menu(false, function (canceled) {
          if(!canceled) {
            elements.removeClass("hasMenu");
          }
        });
      }
      else {
        elements.removeClass("hasMenu");
      }
    },

    enableSideMenu: function () {
      var elements = jq("#content, #menu, #header, #footer");
      elements.addClass("hasMenu");
    },

    isSideMenuEnabled: function () {
      return jq("#content").hasClass("hasMenu");
    },

    isSideMenuOn: function () {
      var menu = jq('#menu');
      return this.isSideMenuEnabled() && (menu.hasClass("on") || menu.hasClass("to-on"));
    },

    update_side_menu: function (elements) {
      var that = this;

      var side_menu_nav = jq("#menu_scroller");

      if(elements === undefined || elements == null) {
        return;
      }
      if(typeof (elements) == "string") {
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
        for(var i = 0; i < elements.length; i++) {
          var node = elements[i].cloneNode(true);
          side_menu_nav.append(node);
        }
      }
      //Move the scroller to the top and hide it
      this.scrolling_divs['menu_scroller'].hideScrollbars();
      this.scrolling_divs['menu_scroller'].scrollToTop();
    }

  }
})(jq);