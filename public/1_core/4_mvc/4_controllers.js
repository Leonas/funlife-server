//controllers.js

(function ($) {

  var viewsCache = [], modelsCache = [], readyFuncs = {}, viewsTotal = {}, modelsTotal = {},
      viewsLoaded = {}, modelsLoaded = {}, controllerReady = {};

  //Create a new controller
  $.mvc.controller = {};

  //We will add each controller given to the $mvc.controller object
  $.mvc.controller.create = function (name, controller) {
    console.log("creating %s with properties: %o", name, controller);
    var loaded = true, i, shortName;

    //make it easily accessible
    $.mvc.controller[name] = controller;

    //stats on total views
    viewsTotal[name] = 0;
    viewsLoaded[name] = 0;

    //stats on total models
    modelsLoaded[name] = 0;
    modelsTotal[name] = 0;
    if(controller.hasOwnProperty("init")) {
      controllerReady[name] = controller;
    }

    return $.mvc.controller[name];

  };

})(jq);



