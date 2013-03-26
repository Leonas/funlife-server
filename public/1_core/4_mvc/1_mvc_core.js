/*global alert: false, confirm: false, console: false */

(function ($) {

	var baseUrl = document.location.protocol + "//" + document.location.host,
        initialUrl = location.href,
        popped = ('state' in window.history);

    $.mvc = {};
  $.mvc.first_pop = true;

    $.mvc.app = function () {
        $.mvc._app = this;
    };

    //Changes to the Object prototype object are propagated to all objects unless the properties
    // and methods subject to those changes are overridden further along the prototype chain.


    $.mvc.app.prototype = {

        _useHistory: false,
        _html5Pop: function (e) {                             //wtf is this shit
            //var initialPop = !popped && location.href !== initialUrl; //Chrome pop fix based on pjax
            //popped = true;
            //if (initialPop) { return; }
            if($.mvc.first_pop){
              $.mvc.first_pop = false;
              return;
            }
            $.mvc.route(document.location.href, e, true);
        },

        useHTML5History: function (hist) {
            if (hist === true) {
                this._useHistory = true;
                window.addEventListener("popstate", this._html5Pop);
            } else {
                this._useHistory = false;
                window.removeEventListener("popstate", this._html5Pop);
            }
        },

        listenHashChange: function (listen) {
            window.addEventListener("hashchange", function (e) {
                var url = document.location.hash.replace("#", "/");
                $.mvc.route(url, e, true);
            });
        }
    };


    $.mvc.route = function (url, evt, noHistory) {

        //Redo this. Error appears when nodeName doesnt exist
        if (typeof (url) !== "string" && url.nodeName && url.nodeName.toLowerCase() === "a") {
            url = url.href;
        }
        if (typeof (url) !== "string") {
          console.log(url);
            throw "Invalid route parameter.  String or <a> expected";
        }
        var route, axt,
            origUrl = url;
        if (url.indexOf(baseUrl) === 0) { url = url.substring(baseUrl.length, url.length); }
        if (url[0] === "/") { url = url.substr(1); }
        if (url[url.length - 1] === "/") { url = url.slice(0, -1); }
        url = url.split("/");

        if (url.length > 1) {
            route = url.splice(0, 1);
            axt = url.splice(0, 1);
        } else {
            route = url[0];
            axt = "default";
        }
        if ($.mvc.controller[route] && $.mvc.controller[route].hasOwnProperty(axt)) {
            evt && evt.preventDefault();
            $.mvc.controller[route][axt].apply($.mvc.controller[route], url);
            if ($.mvc._app._useHistory && noHistory !== true) {
                $.ui.history.push(origUrl);
                window.history.pushState(origUrl, origUrl, origUrl);
            }
            return true;
        }
        return false;
    };


    $.mvc.addRoute = function (url, fnc) {
        var route, axt;

        if (url.indexOf(baseUrl) === 0) {
          url = url.substring(baseUrl.length, url.length);
        }
        if (url[0] === "/") {
          url = url.substr(1);
        }
        url = url.split("/");

        if (url.length > 1) {
            route = url.splice(0, 1);
            axt = url.splice(0, 1);
        } else {
            route = url[0];
            axt = "default";
        }
        if (!$.mvc.controller[route]) {
            $.mvc.controller[route] = {};
        }
        $.mvc.controller[route][axt] = fnc;

    };

    //If $.ui is defined, handle the click through that
    if ($.ui) {
        $.ui.custom_click_handler = $.mvc.route;
    } else {
        $(document).on("click", "a", function (evt) {
            $.mvc.route(evt.target, evt);
        });
    }
})(jq);


