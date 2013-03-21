/*global alert: false, confirm: false, console: false */

(function ($) {
   // "use strict";

                                                                  //lets set the baseUrl to http: // root of host
	var baseUrl = document.location.protocol + "//" + document.location.host,
                                                            //initialUrl will be set to url of the current page
        initialUrl = location.href,
        popped = ('state' in window.history);

    $.mvc = {};

    $.mvc.app = function () {
        $.mvc._app = this;
    };

    //Changes to the Object prototype object are propagated to all objects unless the properties
    // and methods subject to those changes are overridden further along the prototype chain.


    $.mvc.app.prototype = {
        _loadTimer: null,                                     //what is this for?
        _modelsReady: false,
        _controllersReady: false,
        _loadedListeners: [],
        _modelsLoaded: 0,
        _totalModels: 0,
        _controllersDir: "controllers/",                      //set the controllers directory
        _modelsDir: "models/",                                //set the model directory
        _templateType: "text/x-dot-template",
        _hasModels: true,
        _useHistory: false,
        _html5Pop: function (e) {                             //wtf is this shit
            var initialPop = !popped && location.href !== initialUrl; //Chrome pop fix based on pjax
            popped = true;
            if (initialPop) { return; }
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
        },

        ready: function (fnc) {
            if (!this.loaded) {
                $(document).one("jqmvc:loaded", fnc);
            } else {
                fnc();
            }
        },

        loadControllers: function (urls) {
            var that = this, i;
            $(document).ready(function () {

                var file;

                if (typeof (urls) === "string") {
                    urls = [urls];
                }
                for (i = 0; i < urls.length; i++) {
                    file = document.createElement("script");
                    file.src = that._controllersDir + urls[i] + ".js";
                    file.onerror = function (e) {
                        console.log("error ", e);
                    };
                    $("head").append(file);
                    that._loadedListeners[urls[i]] = 1;
                    that._loadedListeners.length++;
                    $(document).one(urls[i] + ":ready", function (e) {
                        delete that._loadedListeners[e.data.name];
                        that._loadedListeners.length--;
                        if (that._loadedListeners.length === 0) {
                            that._controllersReady = true;
                            if (that._modelsReady || !that._hasModels) {
                                $(document).trigger("jqmvc:loaded");
                            } else {
                                that._loadTimer = setTimeout(function () {
                                    that._modelsReady = true;
                                    if (that._controllersReady) { $(document).trigger("jqmvc:loaded"); }
                                }, 1500); //Used if no models are loaded
                            }
                        }
                    });
                    file = null;
                }
            });

        },


        loadModels: function (urls) {
            var that = this, i;

            clearTimeout(this._loadTimer);
            $(document).ready(function () {

                var file;

                if (typeof (urls) === "string") {
                    urls = [urls];
                }
                that._totalModels = urls.length;

                for (i = 0; i < urls.length; i++) {
                    file = document.createElement("script");
                    file.src = that._modelsDir + urls[i] + ".js";
                    file.onload = function () {
                        that._modelsLoaded++;
                        if (that._modelsLoaded >= that._totalModels) {
                            that._modelsReady = true;
                            if (that._controllersReady) { $(document).trigger("jqmvc:loaded"); }
                        }
                    };
                    file.onerror = function (e) {
                        console.log("error ", e);
                    };
                    $("head").append(file);
                    file = null;
                }
            });
        }
    };


    $.mvc.route = function (url, evt, noHistory) {

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
            evt && evt.preventDefault();                                        //What is this for? It doesn't seem to do anything
            $.mvc.controller[route][axt].apply($.mvc.controller[route], url);
            if ($.mvc._app._useHistory && noHistory !== true) {
                $.ui.history.push(origUrl);
              console.log('History1: '+$.ui.history);
                console.log('origUrl'+origUrl);
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


