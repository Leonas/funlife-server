//controllers.js

(function ($) {
    //"use strict";
    var viewsCache = [], modelsCache = [], readyFuncs = {}, viewsTotal = {}, modelsTotal = {},
        viewsLoaded = {}, modelsLoaded = {}, controllerReady = {};


    $.mvc.controller = {};                                                   //set mvc controller to empty object

    $.mvc.controller.create = function (name, object) {
        var loaded = true, i, shortName;
        $.mvc.controller[name] = object;
        viewsTotal[name] = 0;
        viewsLoaded[name] = 0;
        modelsLoaded[name] = 0;
        modelsTotal[name] = 0;
        if (object.hasOwnProperty("init")) { controllerReady[name] = object; }
        if (object.hasOwnProperty("views") && (object.views.length > 0 || Object.keys(object.views).length) > 0) {
            loaded = false;
            viewsTotal[name] = object.views.length || Object.keys(object.views).length;
            for (i in object.views) {
                shortName = $.isArray(object.views) ? object.views[i] : i;                           //replace this
                if (!viewsCache[shortName] && jq("#" + shortName).length === 0) {
                    $.mvc.controller.addView(object.views[i], name, shortName);
                    viewsCache[shortName] = 1;
                }
            }

        }

        if (loaded) {
            $(document).trigger(name + ":ready", {
                'name': name
            });
            controllerReady[name] && controllerReady[name].init.apply(controllerReady[name]);
        }
        return $.mvc.controller[name];

    };


    $.mvc.controller.addView = function (path, controller, name) {
        $.get(path, function (data) {
            $(document.body).append($("<script type='" + $.mvc._app._templateType + "' id='" + name + "'>" + data + "</script>"));
            viewsLoaded[controller]++;
            if ((viewsLoaded[controller] === viewsTotal[controller])) {
                $(document).trigger(controller + ":ready", {
                    name: controller
                });

                controllerReady[controller] && controllerReady[controller].init.apply(controllerReady[controller]);
            }
        });
    };
})(jq);



