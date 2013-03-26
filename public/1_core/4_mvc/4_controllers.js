//controllers.js

(function ($) {

    var viewsCache = [], modelsCache = [], readyFuncs = {}, viewsTotal = {}, modelsTotal = {},
        viewsLoaded = {}, modelsLoaded = {}, controllerReady = {};

    //Create a new controller
    $.mvc.controller = {};

    //We will add each controller given to the $mvc.controller object
    $.mvc.controller.create = function (name, controller) {
        var loaded = true, i, shortName;

        //make it easily accessible
        $.mvc.controller[name] = controller;

        //stats on total views
        viewsTotal[name] = 0;
        viewsLoaded[name] = 0;

        //stats on total models
        modelsLoaded[name] = 0;
        modelsTotal[name] = 0;
        if (controller.hasOwnProperty("init")) { controllerReady[name] = controller; }

        //if the controller has its own views
//        if (controller.hasOwnProperty("views") && (controller.views.length > 0 || controller.keys(controller.views).length) > 0) {
//            loaded = false;
//
//            //total views taken by length of array or by key.
//            viewsTotal[name] = controller.views.length || controller.keys(controller.views).length;
//            for (i in controller.views) {
//                shortName = $.isArray(controller.views) ? controller.views[i] : i;                           //replace this
//                if (!viewsCache[shortName] && jq("#" + shortName).length === 0) {
//                    $.mvc.controller.addView(controller.views[i], name, shortName);
//                    viewsCache[shortName] = 1;
//                }
//            }
//
//        }

//        if (loaded) {
//            $(document).trigger(name + ":ready", {
//                'name': name
//            });
//            controllerReady[name] && controllerReady[name].init.apply(controllerReady[name]);
//        }
        return $.mvc.controller[name];

    };

    //
//    $.mvc.controller.addView = function (path, controller, name) {
//        $.get(path, function (data) {
//            $(document.body).append($("<script type='" + $.mvc._app._templateType + "' id='" + name + "'>" + data + "</script>"));
//            viewsLoaded[controller]++;
//            if ((viewsLoaded[controller] === viewsTotal[controller])) {
//                $(document).trigger(controller + ":ready", {
//                    name: controller
//                });
//
//                console.log('all templates loaded');
//
//                controllerReady[controller] && controllerReady[controller].init.apply(controllerReady[controller]);
//            }
//        });
//    };
})(jq);



