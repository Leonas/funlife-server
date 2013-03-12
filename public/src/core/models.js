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
        for(var a_property in original)
        {
            if (original.hasOwnProperty(a_property)) {
                cloned[a_property] =original[a_property];
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
            var el = $.mvc.model.clone({}, self,true);
            el = $.mvc.model.clone(el, theObj);
            return el;
        }
    };

    $.mvc.model.Extend = function (name, model) {
        return function () {
            return new $.mvc.model(name, model);
        };
    };
})(jq);



