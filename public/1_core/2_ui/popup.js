/**
 * jq.popup - a popup/alert library for html5 mobile apps
 * @copyright Indiepath 2011 - Tim Fisher
 * Modifications/enhancements by appMobi for jqMobi
 *
 */

/* EXAMPLE
 $('body').popup({
 title:"Alert! Alert!",
 message:"This is a test of the emergency alert system!! Don't PANIC!",
 cancelText:"Cancel me",
 cancelCallback: function(){console.log("cancelled");},
 doneText:"I'm done!",
 doneCallback: function(){console.log("Done for!");},
 cancelOnly:false,
 doneClass:'button',
 cancelClass:'button',
 onShow:function(){console.log('showing popup');}
 autoCloseDone:true, //default is true will close the popup when done is clicked.
 suppressTitle:false //Do not show the title if set to true
 });

 You can programatically trigger a close by dispatching a "close" event to it.

 $('body').popup({title:'Alert',id:'myTestPopup'});
 $("#myTestPopup").trigger("close");

 */
(function ($) {

  $.fn.popup = function (options) {
    return new popup(this[0], options);
  };
  var queue = [];
  var popup = (function () {
    var popup = function (containerEl, options) {

      if(typeof containerEl === "string" || containerEl instanceof String) {
        this.container = document.getElementById(containerEl);
      }
      else {
        this.container = containerEl;
      }
      if(!this.container) {
        alert("Error finding container for popup " + containerEl);
        return;
      }

      try {
        if(typeof (options) === "string" || typeof (options) === "number") {
          options = {message: options, cancelOnly: "true", cancelText: "OK"};
        }
        this.id = id = options.id = options.id || $.uuid(); //options is passed by reference
        var self = this;
        this.title = options.suppressTitle ? "" : (options.title || "Alert");
        this.message = options.message || "";
        this.cancelText = options.cancelText || "Cancel";
        this.cancelCallback = options.cancelCallback || function () {
        };
        this.cancelClass = options.cancelClass || "button";
        this.doneText = options.doneText || "Done";
        this.doneCallback = options.doneCallback || function (self) {
          // no action by default
        };
        this.doneClass = options.doneClass || "button";
        this.cancelOnly = options.cancelOnly || false;
        this.onShow = options.onShow || function () {
        };
        this.autoCloseDone = options.autoCloseDone !== undefined ? options.autoCloseDone : true;

        queue.push(this);
        if(queue.length == 1) {
          this.show();
        }
      } catch (e) {
        console.log("error adding popup " + e);
      }

    };

    popup.prototype = {
      id            : null,
      title         : null,
      message       : null,
      cancelText    : null,
      cancelCallback: null,
      cancelClass   : null,
      doneText      : null,
      doneCallback  : null,
      doneClass     : null,
      cancelOnly    : false,
      onShow        : null,
      autoCloseDone : true,
      supressTitle  : false,
      show          : function () {
        var self = this;
        var markup = '<div id="' + this.id + '" class="jqPopup hidden">\
	        				<header>' + this.title + '</header>\
	        				<div><div style="width:1px;height:1px;-webkit-transform:translate3d(0,0,0);float:right"></div>' + this.message + '</div>\
	        				<footer style="clear:both;">\
	        					<a href="javascript:;" class="' + this.cancelClass + '" id="cancel">' + this.cancelText + '</a>\
	        					<a href="javascript:;" class="' + this.doneClass + '" id="action">' + this.doneText + '</a>\
	        				</footer>\
	        			</div></div>';
        $(this.container).append($(markup));

        var $el = $("#" + this.id);
        $el.bind("close", function () {
          self.hide();
        })

        if(this.cancelOnly) {
          $el.find('A#action').hide();
          $el.find('A#cancel').addClass('center');
        }
        $el.find('A').each(function () {
          var button = $(this);
          button.bind('click', function (e) {
            if(button.attr('id') == 'cancel') {
              self.cancelCallback.call(self.cancelCallback, self);
              self.hide();
            }
            else {
              self.doneCallback.call(self.doneCallback, self);
              if(self.autoCloseDone) {
                self.hide();
              }
            }
            e.preventDefault();
          });
        });
        self.positionPopup();
        $.block_ui(0.5);
        $el.removeClass('hidden');
        $el.bind("orientationchange", function () {
          self.positionPopup();
        });

        //force header/footer showing to fix CSS style bugs
        $el.find("header").show();
        $el.find("footer").show();
        this.onShow(this);

      },

      hide: function () {
        var self = this;
        $('#' + self.id).addClass('hidden');
        $.unblock_ui();
        setTimeout(function () {
          self.remove();
        }, 250);
      },

      remove: function () {
        var self = this;
        var $el = $("#" + self.id);
        $el.unbind("close");
        $el.find('BUTTON#action').unbind('click');
        $el.find('BUTTON#cancel').unbind('click');
        $el.unbind("orientationchange").remove();
        queue.splice(0, 1);
        if(queue.length > 0) {
          queue[0].show();
        }
      },

      positionPopup: function () {
        var popup = $('#' + this.id);
        popup.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popup[0].clientHeight / 2) + "px");
        popup.css("left", (window.innerWidth / 2) - (popup[0].clientWidth / 2) + "px");
      }
    };

    return popup;
  })();
  var uiBlocked = false;
  $.block_ui = function (opacity) {
    if(uiBlocked) {
      return;
    }
    opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
    $('BODY').prepend($("<div id='mask'" + opacity + "></div>"));
    $('BODY DIV#mask').bind("touchstart", function (e) {
      e.preventDefault();
    });
    $('BODY DIV#mask').bind("touchmove", function (e) {
      e.preventDefault();
    });
    uiBlocked = true
  };

  $.unblock_ui = function () {
    uiBlocked = false;
    $('BODY DIV#mask').unbind("touchstart");
    $('BODY DIV#mask').unbind("touchmove");
    $("BODY DIV#mask").remove();
  };
  /**
   * Here we override the window.alert function due to iOS eating touch events on native alerts
   */
  window.alert = function (text) {
    if(text === null || text === undefined) {
      text = "null";
    }
    if($("#ui_kit").length > 0) {
      $("#ui_kit").popup(text.toString());
    }
    else {
      $(document.body).popup(text.toString());
    }
  }

})(jq);