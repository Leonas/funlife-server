//models.js

(function ($) {


    $.mvc.model = function (name, options) {
        var new_model = {};
        options && options.modelName && delete options.modelName;      //If there is a model name, delete it
        options && options.id && delete options.id;                    //If there is a model id, delete it
        $.extend(new_model, options);                                  //Extends the obj with additional arguments
        new_model.modelName = name;                                    //set the modelname to given name
        return new_model;
    };



    $.mvc.model.clone = function (cloned, original, clone_proto){       //Clone one model to another (usually {})
        for(var property in original)
        {
            if (original.hasOwnProperty(property)) {
                cloned[property] =original[property];
            }
        }
        if (clone_proto)  {
            cloned.__proto__=original.__proto__;
        }
        return cloned;                                                  //return the cloned model
    };



    $.mvc.model.prototype = {                                    //Each model will inherit these properties

        _prepareModel: function (theObj) {
            var self = this;
            var element = $.mvc.model.clone({}, self,true);
            element = $.mvc.model.clone(element, theObj);
            return element;
        }
    };

    $.mvc.model.Extend = function (name, model) {
        return function () {
            return new $.mvc.model(name, model);
        };
    };
})(jq);



