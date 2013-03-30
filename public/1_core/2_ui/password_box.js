/*
 * jq.web.password_box - password box replacement for html5 mobile apps on android due to a bug with CSS3 translate3d
 * @copyright 2011 - Intel
 */
(function ($) {
  $["password_box"] = function () {

    return new password_box();
  };

  var password_box = function () {
    this.oldPasswords = {};
  };
  password_box.prototype = {
    showPasswordPlainText: false,
    getOldPasswords      : function (element_id) {
      //   if ($.os.android == false) return; -  iOS users seem to want this too, so we'll let everyone join the party
      var container = element_id && document.getElementById(element_id) ? document.getElementById(element_id) : document;
      if(!container) {
        alert("Could not find container element for password_box " + element_id);
        return;
      }
      var sels = container.getElementsByTagName("input");

      var that = this;
      for(var i = 0; i < sels.length; i++) {
        if(sels[i].type != "password") {
          continue;
        }

        if($.os.webkit) {
          sels[i].type = "text";
          sels[i].style['-webkit-text-security'] = "disc";
        }
      }
    },

    changePasswordVisiblity: function (what, id) {
      what = parseInt(what);
      var theEl = document.getElementById(id);

      if(what == 1) { //show
        theEl.style[$.cssPrefix + 'text-security'] = "none";
      }
      else {
        theEl.style[$.cssPrefix + 'text-security'] = "disc";
      }
      if(!$.os.webkit) {
        if(what == 1) {
          theEl.type = "text"
        }
        else {
          theEl.type = "password";
        }
      }
      theEl = null;
    }
  };
})(jq);