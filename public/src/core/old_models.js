//models.js

(function ($) {
    //"use strict";

//    var storageAdapters = {};                                           //Each model can have it's own connector


    $.mvc.model = function (name, options) {
        var new_model = {};
        options && options.modelName && delete options.modelName;      //If there is a model name, delete it
        options && options.id && delete options.id;                    //If there is a model id, delete it
        $.extend(new_model, options);                                  //Extends the obj with additional arguments
        new_model.modelName = name;                                    //set the modelname to given name
        return new_model;
    };


                                                                        //Clone one model to another (usually {})
    $.mvc.model.clone = function (cloned, original, clone_proto){
        for(var a_property in original)
        {
            if (original.hasOwnProperty(a_property)) {
                cloned[a_property] =original[a_property];
            }
        }
        if (clone_proto)  {
            cloned.__proto__=original.__proto__;
        }
        return cloned;                                                    //return the cloned model
    };


                                                          //These are these prototype properties each model inherits
    $.mvc.model.prototype = {
//        fetch: function (obj, callback) {                 //Load a single object by id
//            if (typeof(obj) === "string") {
//                this.id = obj;
//            }
//            var self = this;
////            this.storageAdapter().fetch(self, function (theObj) {
////                var el = self._prepareModel(theObj);
////                if (callback) { return callback(el); }
////                return el;
////            }, this.modelName);
//
//        },
//                                                        //Get all objects for a given type and executes a callback
//        fetchAll: function (callback) {
//            var self = this;
//            this.storageAdapter().fetchAll(self, function (data) {
//                var newRes = [];
//                data.forEach(function (theObj) {
//                    newRes.push(self._prepareModel(theObj));
//                });
//                if (callback) { return callback(newRes); }
//                return newRes;
//            });
//
//        },
//                                                            //Save itself and execute a callback
//        save: function (callback) {
//            return this.storageAdapter().save(this, callback);
//
//        },
//                                                            //Remove itself and execute a callback
//        remove: function (callback) {
//            return this.storageAdapter().remove(this, callback);
//        },
//
//                                                     // Gets a reference to the storage adapter for the object
//        storageAdapter: function () {
//            return storageAdapters[this.modelName];
//        },

                                                    //Prepares a new instance of a given model.  Needed when loading
                                                    //data from a storage adapter to add the new methods, etc.
        _prepareModel: function (theObj) {
            var self = this;
            var el = $.mvc.model.clone({}, self,true);
            el = $.mvc.model.clone(el, theObj);
            return el;
        }
    };



    $.mvc.model.extend = function (name, model) {
        return function () {
            return new $.mvc.model(name, model);
        };
    };





//    var localAdapter = {
//                                                      //linkerCache will hold links to the files we saved
//                                                      //format: linkerCache[modelName][id] = 1 if it exists
//        linkerCache: {},
//        //We do not store all documents in a single record, we keep a lookup document to link them
//        save: function (obj, callback) {
//            if (!obj.id) { obj.id = $.uuid(); }
//            window.localStorage.setItem(obj.id, JSON.stringify(obj));
//            this.linkerCache[obj.modelName][obj.id] = 1;
//            window.localStorage.setItem(obj.modelName + "_linker", JSON.stringify(this.linkerCache[obj.modelName]));
//            console.log(JSON.stringify(this.linkerCache[obj.modelName]));
//            $(document).trigger(obj.modelName + ":save", obj);
//            if (callback) { return callback(obj); }
//        },
//        fetch: function (obj, callback) {
//            var id = obj.id;
//            var el = window.localStorage.getItem(id);
//            try {
//                el = JSON.parse(el);
//            } catch(e) {
//                el = {};
//            }
//            console.log(el);
//            return callback(el);
//        },
//        fetchAll: function (obj, callback) {
//            var type = obj.modelName;
//            var data = JSON.parse(window.localStorage.getItem(type + "_linker"));
//            var res = [];
//            for(var j in data) {
//                if (localStorage[j]) {
//                    var item = JSON.parse(localStorage[j]);
//                    item.id = j;
//                    res.push(item);
//                } else {
//                    delete data[j];
//                }
//            }
//            this.linkerCache[type] = data ? data : {};
//            //Fix dangling references
//            window.localStorage.setItem(type + "_linker", JSON.stringify(this.linkerCache[type]));
//
//            callback(res);
//            console.log(res);
//
//            return callback(res);
//
//        },
//        remove: function (obj, callback) {
//            window.localStorage.removeItem(obj.id);
//            delete this.linkerCache[obj.modelName][obj.id];
//            window.localStorage.setItem(obj.modelName + "_linker", JSON.stringify(this.linkerCache[obj.modelName]));
//            $(document).trigger(obj.modelName + ":remove", obj.id);
//            if (callback) { return callback(obj); }
//        }
//    };
})(jq);



