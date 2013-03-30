/**
 * jq.web.actionsheet - a actionsheet for html5 mobile apps
 * Copyright 2012 - Intel
 */
(function ($) {
  $.fn["actionsheet"] = function (options) {
    var tmp;
    for(var i = 0; i < this.length; i++) {
      tmp = new actionsheet(this[i], options);
    }
    return this.length == 1 ? tmp : this;
  };
  var actionsheet = (function () {
    var actionsheet = function (element_id, options) {
      if(typeof element_id == "string" || element_id instanceof String) {
        this.element = document.getElementById(element_id);
      }
      else {
        this.element = element_id;
      }
      if(!this.element) {
        alert("Could not find element for actionsheet " + element_id);
        return;
      }

      if(this instanceof actionsheet) {
        if(typeof(options) == "object") {
          for(var property in options) {
            this[property] = options[property];
          }
        }
      }
      else {
        return new actionsheet(element_id, options);
      }

      try {
        var that = this;
        var markStart = '<div id="jq_actionsheet"><div style="width:100%">';
        var markEnd = '</div></div>';
        var markup;
        if(typeof options == "string") {
          markup = $(markStart + options + "<a href='javascript:;' class='cancel'>Cancel</a>" + markEnd);
        }
        else if(typeof options == "object") {
          markup = $(markStart + markEnd);
          var container = $(markup.children().get());
          options.push({text: "Cancel", cssClasses: "cancel"});
          for(var i = 0; i < options.length; i++) {
            var item = $('<a href="javascript:;" >' + (options[i].text || "TEXT NOT ENTERED") + '</a>');
            item[0].onclick = (options[i].handler || function () {
            });
            if(options[i].cssClasses && options[i].cssClasses.length > 0) {
              item.addClass(options[i].cssClasses);
            }
            container.append(item);
          }
        }
        $(element_id).find("#jq_actionsheet").remove();
        $(element_id).find("#jq_action_mask").remove();
        actionsheetEl = $(element_id).append(markup);

        markup.get().style[$.feat.cssPrefix + 'Transition'] = "all 0ms";
        markup.css($.feat.cssPrefix + "Transform", "translate" + $.feat.cssTransformStart + "0,0" + $.feat.cssTransformEnd);
        markup.css("top", window.innerHeight + "px");
        this.element.style.overflow = "hidden";
        markup.on("click", "a", function () {
          that.hideSheet()
        });
        this.activeSheet = markup;
        $(element_id).append('<div id="jq_action_mask" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;z-index:9998;background:rgba(0,0,0,.4)"/>');
        setTimeout(function () {
          markup.get().style[$.feat.cssPrefix + 'Transition'] = "all 300ms";
          markup.css($.feat.cssPrefix + "Transform", "translate" + $.feat.cssTransformStart + "0," + (-(markup.height())) + "px" + $.feat.cssTransformEnd);
        }, 10);
      } catch (e) {
        alert("error adding actionsheet" + e);
      }
    };
    actionsheet.prototype = {
      activeSheet: null,
      hideSheet  : function () {
        var that = this;
        this.activeSheet.off("click", "a", function () {
          that.hideSheet()
        });
        $(this.element).find("#jq_action_mask").remove();
        this.activeSheet.get().style[$.feat.cssPrefix + 'Transition'] = "all 0ms";
        var markup = this.activeSheet;
        var theEl = this.element;
        setTimeout(function () {

          markup.get().style[$.feat.cssPrefix + 'Transition'] = "all 300ms";

          markup.css($.feat.cssPrefix + "Transform", "translate" + $.feat.cssTransformStart + "0,0px" + $.feat.cssTransformEnd);
          setTimeout(function () {
            markup.remove();
            markup = null;
            theEl.style.overflow = "none";
          }, 500);
        }, 10);
      }
    };
    return actionsheet;
  })();
})(jq);