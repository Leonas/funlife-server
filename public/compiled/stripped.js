/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

var Base64 = {

  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding
  encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
  },

  // public method for decoding
  decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = Base64._utf8_decode(output);

    return output;

  },

  // private method for UTF-8 encoding
  _utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  },

  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

}
/**
* jqMobi is a query selector class for HTML5 mobile apps on a WebkitBrowser.
* Since most mobile devices (Android, iOS, webOS) use a WebKit browser, you only need to target one browser.
* We are able to increase the speed greatly by removing support for legacy desktop browsers and taking advantage of browser features, like native JSON parsing and querySelectorAll


* MIT License
* @author AppMobi
* @copyright Intel
* @api private
*/
if (!window.jq || typeof (jq) !== "function") {
    /**
     *  This is our master jq object that everything is built upon.
     * $ is a pointer to this object
     * @title jqMobi
     * @api private
     */
    var jq = (function(window) {
        var undefined, document = window.document, 
        emptyArray = [], 
        slice = emptyArray.slice, 
        classCache = {}, 
        eventHandlers = [], 
        _eventID = 1, 
        jsonPHandlers = [], 
        _jsonPID = 1,
        fragementRE=/^\s*<(\w+)[^>]*>/,
        _attrCache={},
        _propCache={};
        
        
        /**
         * internal function to use domfragments for insertion
         *
         * @api private
        */
        function _insertFragments(jqm,container,insert){
            var frag=document.createDocumentFragment();
            if(insert){
                for(var j = jqm.length-1;j>=0;j--)
                {
                    frag.insertBefore(jqm[j],frag.firstChild);
                }
                container.insertBefore(frag,container.firstChild);
            
            }
            else {
            
                for(var j=0;j<jqm.length;j++)
                    frag.appendChild(jqm[j]);
                container.appendChild(frag);
            }
            frag=null;
        }
                
            
                    
        

        /**
         * Internal function to test if a class name fits in a regular expression
         * @param {String} name to search against
         * @return {Boolean}
         * @api private
         */
        function classRE(name) {
            return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
        }

        /**
         * Internal function that returns a array of unique elements
         * @param {Array} array to compare against
         * @return {Array} array of unique elements
         * @api private
         */
        function unique(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr.indexOf(arr[i]) != i) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            return arr;
        }

        /**
         * Given a set of nodes, it returns them as an array.  Used to find
         * siblings of an element
         * @param {Nodelist} Node list to search
         * @param {Object} [element] to find siblings off of
         * @return {Array} array of sibblings
         * @api private
         */
        function siblings(nodes, element) {
            var elements = [];
            if (nodes == undefined)
                return elements;
            
            for (; nodes; nodes = nodes.nextSibling) {
                if (nodes.nodeType == 1 && nodes !== element) {
                    elements.push(nodes);
                }
            }
            return elements;
        }

        /**
         * This is the internal jqMobi object that gets extended and added on to it
         * This is also the start of our query selector engine
         * @param {String|Element|Object|Array} selector
         * @param {String|Element|Object} [context]
         */
        var $jqm = function(toSelect, what) {
            this.length = 0;
            if (!toSelect) {
                return this;
            } else if (toSelect instanceof $jqm && what == undefined) {
                return toSelect;
            } else if ($.isFunction(toSelect)) {
                return $(document).ready(toSelect);
            } else if ($.isArray(toSelect) && toSelect.length != undefined) { //Passing in an array or object
                for (var i = 0; i < toSelect.length; i++)
                    this[this.length++] = toSelect[i];
                return this;
            } else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
                if (toSelect.length == undefined) {
                    if (toSelect.parentNode == what)
                        this[this.length++] = toSelect;
                } else {
                    for (var i = 0; i < toSelect.length; i++)
                        if (toSelect[i].parentNode == what)
                            this[this.length++] = toSelect[i];
                }
                return this;
            } else if ($.isObject(toSelect) && what == undefined) { //Single object
                this[this.length++] = toSelect;
                return this;
            } else if (what !== undefined) {
                if (what instanceof $jqm) {
                    return what.find(toSelect);
                }
            
            } else {
                what = document;
            }
            
            return this.selector(toSelect, what);
            
        };

        /**
         * This calls the $jqm function
         * @param {String|Element|Object|Array} selector
         * @param {String|Element|Object} [context]
         */
        var $ = function(selector, what) {
            return new $jqm(selector, what);
        };

        /**
         * this is the query selector library for elements
         * @param {String} selector
         * @param {String|Element|Object} [context]
         * @api private
         */
 		function _selectorAll(selector, what){
 			try{
 				return what.querySelectorAll(selector);
 			} catch(e){
 				return [];
 			}
 		};
        function _selector(selector, what) {
            

			selector=selector.trim();
            
            if (selector[0] === "#" && selector.indexOf(".")==-1 && selector.indexOf(" ")===-1 && selector.indexOf(">")===-1){
                if (what == document)
                    _shimNodes(what.getElementById(selector.replace("#", "")),this);
                else
                    _shimNodes(_selectorAll(selector, what),this);
            } else if (selector[0] === "<" && selector[selector.length - 1] === ">")  //html
            {
                var tmp = document.createElement("div");
                tmp.innerHTML = selector.trim();
                _shimNodes(tmp.childNodes,this);
            } else {
                _shimNodes((_selectorAll(selector, what)),this);
            }
            return this;
        }
		
        function _shimNodes(nodes,object){
            if(!nodes)
                return;
            if(nodes.nodeType)
                return object[object.length++]=nodes;
            for(var i=0,iz=nodes.length;i<iz;i++)
                object[object.length++]=nodes[i];
        }
        /**
        * Checks to see if the parameter is a $jqm object
            ```
            var foo=$('#header');
            $.is$(foo);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.is$(param)
        */
		$.is$ = function(object){return object instanceof $jqm;}
        /**
        * Map takes in elements and executes a callback function on each and returns a collection
        ```
        $.map([1,2],function(ind){return ind+1});
        ```

        * @param {Array|Object} elements
        * @param {Function} callback
        * @return {Object} jqMobi object with elements in it
        * @title $.map(elements,callback)
        */
        $.map = function(elements, callback) {
            var value, values = [], 
            i, key;
            if ($.isArray(elements))
                for (i = 0; i < elements.length; i++) {
                    value = callback(elements[i], i);
                    if (value !== undefined)
                        values.push(value);
                }
            else if ($.isObject(elements))
                for (key in elements) {
                    if (!elements.hasOwnProperty(key))
                        continue;
                    value = callback(elements[key], key);
                    if (value !== undefined)
                        values.push(value);
                }
            return $([values]);
        };

        /**
        * Iterates through elements and executes a callback.  Returns if false
        ```
        $.each([1,2],function(ind){console.log(ind);});
        ```

        * @param {Array|Object} elements
        * @param {Function} callback
        * @return {Array} elements
        * @title $.each(elements,callback)
        */
        $.each = function(elements, callback) {
            var i, key;
            if ($.isArray(elements))
                for (i = 0; i < elements.length; i++) {
                    if (callback(i, elements[i]) === false)
                        return elements;
                }
            else if ($.isObject(elements))
                for (key in elements) {
                    if (!elements.hasOwnProperty(key))
                        continue;
                    if (callback(key, elements[key]) === false)
                        return elements;
                }
            return elements;
        };

        /**
        * Extends an object with additional arguments
            ```
            $.extend({foo:'bar'});
            $.extend(element,{foo:'bar'});
            ```

        * @param {Object} [target] element
        * @param any number of additional arguments
        * @return {Object} [target]
        * @title $.extend(target,{params})
        */
        $.extend = function(target) {
            if (target == undefined)
                target = this;
            if (arguments.length === 1) {
                for (var key in target)
                    this[key] = target[key];
                return this;
            } else {
                slice.call(arguments, 1).forEach(function(source) {
                    for (var key in source)
                        target[key] = source[key];
                });
            }
            return target;
        };

        /**
        * Checks to see if the parameter is an array
            ```
            var arr=[];
            $.isArray(arr);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @example $.isArray([1]);
        * @title $.isArray(param)
        */
        $.isArray = function(object) {
            return object instanceof Array && object['push'] != undefined; //ios 3.1.3 doesn't have Array.isArray
        };

        /**
        * Checks to see if the parameter is a function
            ```
            var func=function(){};
            $.isFunction(func);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.isFunction(param)
        */
        $.isFunction = function(object) {
            return typeof object === "function";
        };
        /**
        * Checks to see if the parameter is a object
            ```
            var foo={bar:'bar'};
            $.isObject(foo);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.isObject(param)
        */
        $.isObject = function(object) {
            return typeof object === "object";
        };

        /**
         * Prototype for jqm object.  Also extens $.fn
         */
        $.fn = $jqm.prototype = {
            constructor: $jqm,
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            indexOf: emptyArray.indexOf,
            concat: emptyArray.concat,
            selector: _selector,
            oldElement: undefined,
            slice: emptyArray.slice,
            /**
             * This is a utility function for .end()
             * @param {Object} params
             * @return {Object} a jqMobi with params.oldElement set to this
             * @api private
             */
            setupOld: function(params) {
                if (params == undefined)
                    return $();
                params.oldElement = this;
                return params;
            
            },
            /**
            * This is a wrapper to $.map on the selected elements
                ```
                $().map(function(){this.value+=ind});
                ```

            * @param {Function} callback
            * @return {Object} a jqMobi object
            * @title $().map(function)
            */
            map: function(fn) {
                var value, values = [], i;
                for (i = 0; i < this.length; i++) {
                    value = fn(i,this[i]);
                    if (value !== undefined)
                        values.push(value);
                }
                return $([values]);
            },
            /**
            * Iterates through all elements and applys a callback function
                ```
                $().each(function(){console.log(this.value)});
                ```

            * @param {Function} callback
            * @return {Object} a jqMobi object
            * @title $().each(function)
            */
            each: function(callback) {
                this.forEach(function(element, idx) {
                    callback.call(element, idx, element);
                });
                return this;
            },
            /**
            * This is executed when DOMContentLoaded happens, or after if you've registered for it.
                ```
                $(document).ready(function(){console.log('I'm ready');});
                ```

            * @param {Function} callback
            * @return {Object} a jqMobi object
            * @title $().ready(function)
            */
            
            ready: function(callback) {
                if (document.readyState === "complete" || document.readyState === "loaded"||(!$.os.ie&&document.readyState==="interactive")) //IE10 fires interactive too early
                    callback();
                else
                    document.addEventListener("DOMContentLoaded", callback, false);
                return this;
            },
            /**
            * Searches through the collection and reduces them to elements that match the selector
                ```
                $("#foo").find('.bar');
                $("#foo").find($('.bar'));
                $("#foo").find($('.bar').get());
                ```

            * @param {String|Object|Array} selector
            * @return {Object} a jqMobi object filtered
            * @title $().find(selector)

            */
            find: function(selector) {
                if (this.length === 0)
                    return this;
                var elements = [];
                var temporary_elements;
                for (var i = 0; i < this.length; i++) {
                    temporary_elements = ($(selector, this[i]));
                    
                    for (var j = 0; j < temporary_elements.length; j++) {
                        elements.push(temporary_elements[j]);
                    }
                }
                return $(unique(elements));
            },
            /**
            * Gets or sets the innerHTML for the collection.
            * If used as a get, the first elements innerHTML is returned
                ```
                $("#foo").html(); //gets the first elements html
                $("#foo").html('new html');//sets the html
                $("#foo").html('new html',false); //Do not do memory management cleanup
                ```

            * @param {String} html to set
            * @param {Bool} [cleanup] - set to false for performance tests and if you do not want to execute memory management cleanup
            * @return {Object} a jqMobi object
            * @title $().html([html])
            */
            html: function(html,cleanup) {
                if (this.length === 0)
                    return this;
                if (html === undefined)
                    return this[0].innerHTML;

                for (var i = 0; i < this.length; i++) {
                    if(cleanup!==false)
                        $.cleanUpContent(this[i], false, true);
                    this[i].innerHTML = html;
                }
                return this;
            },


            /**
            * Gets or sets the innerText for the collection.
            * If used as a get, the first elements innerText is returned
                ```
                $("#foo").text(); //gets the first elements text;
                $("#foo").text('new text'); //sets the text
                ```

            * @param {String} text to set
            * @return {Object} a jqMobi object
            * @title $().text([text])
            */
            text: function(text) {
                if (this.length === 0)
                    return this;
                if (text === undefined)
                    return this[0].textContent;
                for (var i = 0; i < this.length; i++) {
                    this[i].textContent = text;
                }
                return this;
            },
            /**
            * Gets or sets a css property for the collection
            * If used as a get, the first elements css property is returned
                ```
                $().css("background"); // Gets the first elements background
                $().css("background","red")  //Sets the elements background to red
                ```

            * @param {String} attribute to get
            * @param {String} value to set as
            * @return {Object} a jqMobi object
            * @title $().css(attribute,[value])
            */
            css: function(attribute, value, object) {
                var toAct = object != undefined ? object : this[0];
                if (this.length === 0)
                    return this;
                if (value == undefined && typeof (attribute) === "string") {
                    var styles = window.getComputedStyle(toAct);
                    return  toAct.style[attribute] ? toAct.style[attribute]: window.getComputedStyle(toAct)[attribute] ;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(attribute)) {
                        for (var j in attribute) {
                            this[i].style[j] = attribute[j];
                        }
                    } else {
                        this[i].style[attribute] = value;
                    }
                }
                return this;
            },
            /**
             * Gets or sets css vendor specific css properties
            * If used as a get, the first elements css property is returned
                ```
                $().css("background"); // Gets the first elements background
                $().css("background","red")  //Sets the elements background to red
                ```

            * @param {String} attribute to get
            * @param {String} value to set as
            * @return {Object} a jqMobi object
            * @title $().css(attribute,[value])
            */
            vendorCss:function(attribute,value,object){
                return this.css($.feat.cssPrefix+attribute,value,object);
            },
            /**
            * Sets the innerHTML of all elements to an empty string
                ```
                $().empty();
                ```

            * @return {Object} a jqMobi object
            * @title $().empty()
            */
            empty: function() {
                for (var i = 0; i < this.length; i++) {
                    $.cleanUpContent(this[i], false, true);
                    this[i].innerHTML = '';
                }
                return this;
            },
            /**
            * Sets the elements display property to "none".
            * This will also store the old property into an attribute for hide
                ```
                $().hide();
                ```

            * @return {Object} a jqMobi object
            * @title $().hide()
            */
            hide: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) != "none") {
                        this[i].setAttribute("jqmOldStyle", this.css("display", null, this[i]));
                        this[i].style.display = "none";
                    }
                }
                return this;
            },
            /**
            * Shows all the elements by setting the css display property
            * We look to see if we were retaining an old style (like table-cell) and restore that, otherwise we set it to block
                ```
                $().show();
                ```

            * @return {Object} a jqMobi object
            * @title $().show()
            */
            show: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) == "none") {
                        this[i].style.display = this[i].getAttribute("jqmOldStyle") ? this[i].getAttribute("jqmOldStyle") : 'block';
                        this[i].removeAttribute("jqmOldStyle");
                    }
                }
                return this;
            },
            /**
            * Toggle the visibility of a div
                ```
                $().toggle();
                $().toggle(true); //force showing
                ```

            * @param {Boolean} [show] -force the hiding or showing of the element
            * @return {Object} a jqMobi object
            * @title $().toggle([show])
            */
            toggle: function(show) {
                var show2 = show === true ? true : false;
                for (var i = 0; i < this.length; i++) {
                    if (window.getComputedStyle(this[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
                        this[i].setAttribute("jqmOldStyle", this[i].style.display)
                        this[i].style.display = "none";
                    } else {
                        this[i].style.display = this[i].getAttribute("jqmOldStyle") != undefined ? this[i].getAttribute("jqmOldStyle") : 'block';
                        this[i].removeAttribute("jqmOldStyle");
                    }
                }
                return this;
            },
            /**
            * Gets or sets an elements value
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().value; //Gets the first elements value;
                $().value="bar"; //Sets all elements value to bar
                ```

            * @param {String} [value] to set
            * @return {String|Object} A string as a getter, jqMobi object as a setter
            * @title $().val([value])
            */
            val: function(value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;
                if (value == undefined)
                    return this[0].value;
                for (var i = 0; i < this.length; i++) {
                    this[i].value = value;
                }
                return this;
            },
            /**
            * Gets or sets an attribute on an element
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().attr("foo"); //Gets the first elements 'foo' attribute
                $().attr("foo","bar");//Sets the elements 'foo' attribute to 'bar'
                $().attr("foo",{bar:'bar'}) //Adds the object to an internal cache
                ```

            * @param {String|Object} attribute to act upon.  If it's an object (hashmap), it will set the attributes based off the kvp.
            * @param {String|Array|Object|function} [value] to set
            * @return {String|Object|Array|Function} If used as a getter, return the attribute value.  If a setter, return a jqMobi object
            * @title $().attr(attribute,[value])
            */
            attr: function(attr, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;            
                if (value === undefined && !$.isObject(attr)) {
                    var val = (this[0].jqmCacheId&&_attrCache[this[0].jqmCacheId][attr])?(this[0].jqmCacheId&&_attrCache[this[0].jqmCacheId][attr]):this[0].getAttribute(attr);
                    return val;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(attr)) {
                        for (var key in attr) {
                            $(this[i]).attr(key,attr[key]);
                        }
                    }
                    else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
                    {
                        
                        if(!this[i].jqmCacheId)
                            this[i].jqmCacheId=$.uuid();
                        
                        if(!_attrCache[this[i].jqmCacheId])
                            _attrCache[this[i].jqmCacheId]={}
                        _attrCache[this[i].jqmCacheId][attr]=value;
                    }
                    else if (value == null && value !== undefined)
                    {
                        this[i].removeAttribute(attr);
                        if(this[i].jqmCacheId&&_attrCache[this[i].jqmCacheId][attr])
                            delete _attrCache[this[i].jqmCacheId][attr];
                    }
                    else{
                        this[i].setAttribute(attr, value);
                    }
                }
                return this;
            },
            /**
            * Removes an attribute on the elements
                ```
                $().removeAttr("foo");
                ```

            * @param {String} attributes that can be space delimited
            * @return {Object} jqMobi object
            * @title $().removeAttr(attribute)
            */
            removeAttr: function(attr) {
                var that = this;
                for (var i = 0; i < this.length; i++) {
                    attr.split(/\s+/g).forEach(function(param) {
                        that[i].removeAttribute(param);
                        if(that[i].jqmCacheId&&_attrCache[that[i].jqmCacheId][attr])
                            delete _attrCache[that[i].jqmCacheId][attr];
                    });
                }
                return this;
            },

            /**
            * Gets or sets a property on an element
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().prop("foo"); //Gets the first elements 'foo' property
                $().prop("foo","bar");//Sets the elements 'foo' property to 'bar'
                $().prop("foo",{bar:'bar'}) //Adds the object to an internal cache
                ```

            * @param {String|Object} property to act upon.  If it's an object (hashmap), it will set the attributes based off the kvp.
            * @param {String|Array|Object|function} [value] to set
            * @return {String|Object|Array|Function} If used as a getter, return the property value.  If a setter, return a jqMobi object
            * @title $().prop(property,[value])
            */
            prop: function(prop, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;          
                if (value === undefined && !$.isObject(prop)) {
                    var res;
                    var val = (this[0].jqmCacheId&&_propCache[this[0].jqmCacheId][prop])?(this[0].jqmCacheId&&_propCache[this[0].jqmCacheId][prop]):!(res=this[0][prop])&&prop in this[0]?this[0][prop]:res;
                    return val;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(prop)) {
                        for (var key in prop) {
                            $(this[i]).prop(key,prop[key]);
                        }
                    }
                    else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
                    {
                        
                        if(!this[i].jqmCacheId)
                            this[i].jqmCacheId=$.uuid();
                        
                        if(!_propCache[this[i].jqmCacheId])
                            _propCache[this[i].jqmCacheId]={}
                        _propCache[this[i].jqmCacheId][prop]=value;
                    }
                    else if (value == null && value !== undefined)
                    {
                        $(this[i]).removeProp(prop);
                    }
                    else{
                        this[i][prop]= value;
                    }
                }
                return this;
            },
            /**
            * Removes a property on the elements
                ```
                $().removeProp("foo");
                ```

            * @param {String} properties that can be space delimited
            * @return {Object} jqMobi object
            * @title $().removeProp(attribute)
            */
            removeProp: function(prop) {
                var that = this;
                for (var i = 0; i < this.length; i++) {
                    prop.split(/\s+/g).forEach(function(param) {
                        if(that[i][param])
                            delete that[i][param];
                        if(that[i].jqmCacheId&&_propCache[that[i].jqmCacheId][prop]){
                                delete _propCache[that[i].jqmCacheId][prop];
                        }
                    });
                }
                return this;
            },

            /**
            * Removes elements based off a selector
                ```
                $().remove();  //Remove all
                $().remove(".foo");//Remove off a string selector
                var element=$("#foo").get();
                $().remove(element); //Remove by an element
                $().remove($(".foo"));  //Remove by a collection

                ```

            * @param {String|Object|Array} selector to filter against
            * @return {Object} jqMobi object
            * @title $().remove(selector)
            */
            remove: function(selector) {
                var elements = $(this).filter(selector);
                if (elements == undefined)
                    return this;
                for (var i = 0; i < elements.length; i++) {
                    $.cleanUpContent(elements[i], true, true);
                    elements[i].parentNode.removeChild(elements[i]);
                }
                return this;
            },
            /**
            * Adds a css class to elements.
                ```
                $().addClass("selected");
                ```

            * @param {String} classes that are space delimited
            * @return {Object} jqMobi object
            * @title $().addClass(name)
            */
            addClass: function(name) {
                for (var i = 0; i < this.length; i++) {
                    var cls = this[i].className;
                    var classList = [];
                    var that = this;
                    name.split(/\s+/g).forEach(function(cname) {
                        if (!that.hasClass(cname, that[i]))
                            classList.push(cname);
                    });
                    
                    this[i].className += (cls ? " " : "") + classList.join(" ");
                    this[i].className = this[i].className.trim();
                }
                return this;
            },
            /**
            * Removes a css class from elements.
                ```
                $().removeClass("foo"); //single class
                $().removeClass("foo selected");//remove multiple classess
                ```

            * @param {String} classes that are space delimited
            * @return {Object} jqMobi object
            * @title $().removeClass(name)
            */
            removeClass: function(name) {
                for (var i = 0; i < this.length; i++) {
                    if (name == undefined) {
                        this[i].className = '';
                        return this;
                    }
                    var classList = this[i].className;
                    name.split(/\s+/g).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
                    if (classList.length > 0)
                        this[i].className = classList.trim();
                    else
                        this[i].className = "";
                }
                return this;
            },
            /**
            * Replaces a css class on elements.
                ```
                $().replaceClass("on", "off");
                ```

            * @param {String} classes that are space delimited
			* @param {String} classes that are space delimited
            * @return {Object} jqMobi object
            * @title $().replaceClass(old, new)
            */
            replaceClass: function(name, newName) {
                for (var i = 0; i < this.length; i++) {
                    if (name == undefined) {
                        this[i].className = newName;
                        continue;
                    }
                    var classList = this[i].className;
                    name.split(/\s+/g).concat(newName.split(/\s+/g)).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
					classList=classList.trim();
                    if (classList.length > 0){
                    	this[i].className = (classList+" "+newName).trim();
                    } else
                        this[i].className = newName;
                }
                return this;
            },
            /**
            * Checks to see if an element has a class.
                ```
                $().hasClass('foo');
                $().hasClass('foo',element);
                ```

            * @param {String} class name to check against
            * @param {Object} [element] to check against
            * @return {Boolean}
            * @title $().hasClass(name,[element])
            */
            hasClass: function(name, element) {
                if (this.length === 0)
                    return false;
                if (!element)
                    element = this[0];
                return classRE(name).test(element.className);
            },
            /**
            * Appends to the elements
            * We boil everything down to a jqMobi object and then loop through that.
            * If it's HTML, we create a dom element so we do not break event bindings.
            * if it's a script tag, we evaluate it.
                ```
                $().append("<div></div>"); //Creates the object from the string and appends it
                $().append($("#foo")); //Append an object;
                ```

            * @param {String|Object} Element/string to add
            * @param {Boolean} [insert] insert or append
            * @return {Object} jqMobi object
            * @title $().append(element,[insert])
            */
            append: function(element, insert) {
                if (element && element.length != undefined && element.length === 0)
                    return this;
                if ($.isArray(element) || $.isObject(element))
                    element = $(element);
                var i;
                
                
                for (i = 0; i < this.length; i++) {
                    if (element.length && typeof element != "string") {
                        element = $(element);
                        _insertFragments(element,this[i],insert);
                    } else {
                        var object =fragementRE.test(element)?$(element):undefined;
                        if (object == undefined || object.length == 0) {
                            object = document.createTextNode(element);
                        }
                        if (object.nodeName != undefined && object.nodeName.toLowerCase() == "script" && (!object.type || object.type.toLowerCase() === 'text/javascript')) {
                            window.eval(object.innerHTML);
                        } else if(object instanceof $jqm) {
                            _insertFragments(object,this[i],insert);
                        }
                        else {
                            insert != undefined ? this[i].insertBefore(object, this[i].firstChild) : this[i].appendChild(object);
                        }
                    }
                }
                return this;
            },
             /**
            * Appends the current collection to the selector
                ```
                $().appendTo("#foo"); //Append an object;
                ```

            * @param {String|Object} Selector to append to
            * @param {Boolean} [insert] insert or append
            * @title $().appendTo(element,[insert])
            */
            appendTo:function(selector,insert){
                var tmp=$(selector);
                tmp.append(this);
                return this;
            },
             /**
            * Prepends the current collection to the selector
                ```
                $().prependTo("#foo"); //Prepend an object;
                ```

            * @param {String|Object} Selector to prepent to
            * @title $().prependTo(element)
            */
            prependTo:function(selector){
                var tmp=$(selector);
                tmp.append(this,true);
                return this;
            },
            /**
            * Prepends to the elements
            * This simply calls append and sets insert to true
                ```
                $().prepend("<div></div>");//Creates the object from the string and appends it
                $().prepend($("#foo")); //Prepends an object
                ```

            * @param {String|Object} Element/string to add
            * @return {Object} jqMobi object
            * @title $().prepend(element)
            */
            prepend: function(element) {
                return this.append(element, 1);
            },
            /**
             * Inserts collection before the target (adjacent)
                ```
                $().insertBefore(jq("#target"));
                ```
             
             * @param {String|Object} Target
             * @title $().insertBefore(target);
             */
            insertBefore: function(target, after) {
                if (this.length == 0)
                    return this;
                target = $(target).get(0);
                if (!target)
                    return this;
                for (var i = 0; i < this.length; i++) 
                {
                    after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
                }
                return this;
            },
            /**
             * Inserts collection after the target (adjacent)
                ```
                $().insertAfter(jq("#target"));
                ```
             * @param {String|Object} target
             * @title $().insertAfter(target);
             */
            insertAfter: function(target) {
                this.insertBefore(target, true);
            },
            /**
            * Returns the raw DOM element.
                ```
                $().get(); //returns the first element
                $().get(2);// returns the third element
                ```

            * @param {Int} [index]
            * @return {Object} raw DOM element
            * @title $().get([index])
            */
            get: function(index) {
                index = index == undefined ? 0 : index;
                if (index < 0)
                    index += this.length;
                return (this[index]) ? this[index] : undefined;
            },
            /**
            * Returns the offset of the element, including traversing up the tree
                ```
                $().offset();
                ```

            * @return {Object} with left, top, width and height properties
            * @title $().offset()
            */
            offset: function() {
                if (this.length === 0)
                    return this;
                if(this[0]==window)
                    return {
                        left:0,
                        top:0,
                        right:0,
                        bottom:0,
                        width:window.innerWidth,
                        height:window.innerHeight
                    }
                else
                    var object = this[0].getBoundingClientRect();
                return {
                    left: object.left + window.pageXOffset,
                    top: object.top + window.pageYOffset,
                    right: object.right + window.pageXOffset,
                    bottom: object.bottom + window.pageYOffset,
                    width: object.right-object.left,
                    height: object.bottom-object.top
                };
            },
             /**
             * returns the height of the element, including padding on IE
               ```
               $().height();
               ```
             * @return {string} height
             * @title $().height()
             */
            height:function(val){
                if (this.length === 0)
                    return this;
                if(val!=undefined)
                    return this.css("height",val);
                if(this[0]==this[0].window)
                    return window.innerHeight;
                if(this[0].nodeType==this[0].DOCUMENT_NODE)
                    return this[0].documentElement['offsetheight'];
                else
                {
                    var tmpVal=this.css("height").replace("px","");
                    if(tmpVal)
                        return tmpVal
                    else
                        return this.offset().height;
                }
            },
            /**
             * returns the width of the element, including padding on IE
               ```
               $().width();
               ```
             * @return {string} width
             * @title $().width()
             */
            width:function(val){
                if (this.length === 0)
                    return this;
                 if(val!=undefined)
                    return this.css("width",val);
                if(this[0]==this[0].window)
                    return window.innerWidth;
                if(this[0].nodeType==this[0].DOCUMENT_NODE)
                    return this[0].documentElement['offsetwidth'];
                else{
                     var tmpVal=this.css("width").replace("px","");
                    if(tmpVal)
                        return tmpVal
                    else
                        return this.offset().width;
                }
            },
            /**
            * Returns the parent nodes of the elements based off the selector
                ```
                $("#foo").parent('.bar');
                $("#foo").parent($('.bar'));
                $("#foo").parent($('.bar').get());
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique parents
            * @title $().parent(selector)
            */
            parent: function(selector,recursive) {
                if (this.length == 0)
                    return this;
                var elements = [];
                for (var i = 0; i < this.length; i++) {
                    var tmp=this[i];
                    while(tmp.parentNode&&tmp.parentNode!=document){
                        elements.push(tmp.parentNode);
                        if(tmp.parentNode)
                            tmp=tmp.parentNode;
                        if(!recursive)
                            break;
                    }
                }
                return this.setupOld($(unique(elements)).filter(selector));
            },
             /**
            * Returns the parents of the elements based off the selector (traversing up until html document)
                ```
                $("#foo").parents('.bar');
                $("#foo").parents($('.bar'));
                $("#foo").parents($('.bar').get());
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique parents
            * @title $().parents(selector)
            */
            parents: function(selector) {
                return this.parent(selector,true);
            },
            /**
            * Returns the child nodes of the elements based off the selector
                ```
                $("#foo").children('.bar'); //Selector
                $("#foo").children($('.bar')); //Objects
                $("#foo").children($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique children
            * @title $().children(selector)
            */
            children: function(selector) {
                
                if (this.length == 0)
                    return this;
                var elements = [];
                for (var i = 0; i < this.length; i++) {
                    elements = elements.concat(siblings(this[i].firstChild));
                }
                return this.setupOld($((elements)).filter(selector));
            
            },
            /**
            * Returns the siblings of the element based off the selector
                ```
                $("#foo").siblings('.bar'); //Selector
                $("#foo").siblings($('.bar')); //Objects
                $("#foo").siblings($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique siblings
            * @title $().siblings(selector)
            */
            siblings: function(selector) {
                if (this.length == 0)
                    return this;
                var elements = [];
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode)
                        elements = elements.concat(siblings(this[i].parentNode.firstChild, this[i]));
                }
                return this.setupOld($(elements).filter(selector));
            },
            /**
            * Returns the closest element based off the selector and optional context
                ```
                $("#foo").closest('.bar'); //Selector
                $("#foo").closest($('.bar')); //Objects
                $("#foo").closest($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} selector
            * @param {Object} [context]
            * @return {Object} Returns a jqMobi object with the closest element based off the selector
            * @title $().closest(selector,[context]);
            */
            closest: function(selector, context) {
                if (this.length == 0)
                    return this;
                var elements = [],
                cur = this[0];
                
                var start = $(selector, context);
                if (start.length == 0)
                    return $();
                while (cur && start.indexOf(cur) == -1) {
                    cur = cur !== context && cur !== document && cur.parentNode;
                }
                return $(cur);
            
            },
            /**
            * Filters elements based off the selector
                ```
                $("#foo").filter('.bar'); //Selector
                $("#foo").filter($('.bar')); //Objects
                $("#foo").filter($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} selector
            * @return {Object} Returns a jqMobi object after the filter was run
            * @title $().filter(selector);
            */
            filter: function(selector) {
                if (this.length == 0)
                    return this;
                
                if (selector == undefined)
                    return this;
                var elements = [];
                for (var i = 0; i < this.length; i++) {
                    var val = this[i];
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) >= 0)
                        elements.push(val);
                }
                return this.setupOld($(unique(elements)));
            },
            /**
            * Basically the reverse of filter.  Return all elements that do NOT match the selector
                ```
                $("#foo").not('.bar'); //Selector
                $("#foo").not($('.bar')); //Objects
                $("#foo").not($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} selector
            * @return {Object} Returns a jqMobi object after the filter was run
            * @title $().not(selector);
            */
            not: function(selector) {
                if (this.length == 0)
                    return this;
                var elements = [];
                for (var i = 0; i < this.length; i++) {
                    var val = this[i];
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) == -1)
                        elements.push(val);
                }
                return this.setupOld($(unique(elements)));
            },
            /**
            * Gets or set data-* attribute parameters on elements
            * When used as a getter, it's only the first element
                ```
                $().data("foo"); //Gets the data-foo attribute for the first element
                $().data("foo","bar"); //Sets the data-foo attribute for all elements
                $().data("foo",{bar:'bar'});//object as the data
                ```

            * @param {String} key
            * @param {String|Array|Object} value
            * @return {String|Object} returns the value or jqMobi object
            * @title $().data(key,[value]);
            */
            data: function(key, value) {
                return this.attr('data-' + key, value);
            },
            /**
            * Rolls back the jqMobi elements when filters were applied
            * This can be used after .not(), .filter(), .children(), .parent()
                ```
                $().filter(".panel").end(); //This will return the collection BEFORE filter is applied
                ```

            * @return {Object} returns the previous jqMobi object before filter was applied
            * @title $().end();
            */
            end: function() {
                return this.oldElement != undefined ? this.oldElement : $();
            },
            /**
            * Clones the nodes in the collection.
                ```
                $().clone();// Deep clone of all elements
                $().clone(false); //Shallow clone
                ```

            * @param {Boolean} [deep] - do a deep copy or not
            * @return {Object} jqMobi object of cloned nodes
            * @title $().clone();
            */
            clone: function(deep) {
                deep = deep === false ? false : true;
                if (this.length == 0)
                    return this;
                var elements = [];
                for (var i = 0; i < this.length; i++) {
                    elements.push(this[i].cloneNode(deep));
                }
                
                return $(elements);
            },
            /**
            * Returns the number of elements in the collection
                ```
                $().size();
                ```

            * @return {Int}
            * @title $().size();
            */
            size: function() {
                return this.length;
            },
            /**
             * Serailizes a form into a query string
               ```
               $().serialize();
               ```
             * @return {String}
             * @title $().serialize()
             */
            serialize: function() {
                if (this.length == 0)
                    return "";
                var params = [];
                for (var i = 0; i < this.length; i++) 
                {
                    this.slice.call(this[i].elements).forEach(function(elem) {
                        var type = elem.getAttribute("type");
                        if (elem.nodeName.toLowerCase() != "fieldset" && !elem.disabled && type != "submit" 
                        && type != "reset" && type != "button" && ((type != "radio" && type != "checkbox") || elem.checked))
                        {

                            if(elem.getAttribute("name")){
                                if(elem.type=="select-multiple"){
                                    for(var j=0;j<elem.options.length;j++){
                                        if(elem.options[j].selected)
                                            params.push(elem.getAttribute("name")+"="+encodeURIComponent(elem.options[j].value))
                                    }
                                }
                                else
                                    params.push(elem.getAttribute("name")+"="+encodeURIComponent(elem.value))
                            }
                        }
                    });
                }
                return params.join("&");
            },

            /* added in 1.2 */
            /**
             * Reduce the set of elements based off index
                ```
               $().eq(index)
               ```
             * @param {Int} index - Index to filter by. If negative, it will go back from the end
             * @return {Object} jqMobi object
             * @title $().eq(index)
             */
            eq:function(ind){
                return $(this.get(ind));
            },
            /**
             * Returns the index of the selected element in the collection
               ```
               $().index(elem)
               ```
             * @param {String|Object} element to look for.  Can be a selector or object
             * @return integer - index of selected element
             * @title $().index(elem)
             */
            index:function(elem){
                return elem?this.indexOf($(elem)[0]):this.parent().children().indexOf(this[0]);
            },
            /**
              * Returns boolean if the object is a type of the selector
              ```
              $().is(selector)
              ```
             * param {String|Object|Function} selector to act upon
             * @return boolean
             * @title $().is(selector)
             */
            is:function(selector){
                return !!selector&&this.filter(selector).length>0;
            }

        };


        /* AJAX functions */
        
        function empty() {
        }
        var ajaxSettings = {
            type: 'GET',
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: undefined,
            timeout: 0,
            crossDomain: null
        };
        /**
        * Execute a jsonP call, allowing cross domain scripting
        * options.url - URL to call
        * options.success - Success function to call
        * options.error - Error function to call
            ```
            $.jsonP({url:'mysite.php?callback=?&foo=bar',success:function(){},error:function(){}});
            ```

        * @param {Object} options
        * @title $.jsonP(options)
        */
        $.jsonP = function(options) {
            var callbackName = 'jsonp_callback' + (++_jsonPID);
            var abortTimeout = "", 
            context;
            var script = document.createElement("script");
            var abort = function() {
                $(script).remove();
                if (window[callbackName])
                    window[callbackName] = empty;
            };
            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
                options.success.call(context, data);
            };
            script.src = options.url.replace(/=\?/, '=' + callbackName);
            if(options.error)
            {
               script.onerror=function(){
                  clearTimeout(abortTimeout);
                  options.error.call(context, "", 'error');
               }
            }
            $('head').append(script);
            if (options.timeout > 0)
                abortTimeout = setTimeout(function() {
                    options.error.call(context, "", 'timeout');
                }, options.timeout);
            return {};
        };

        /**
        * Execute an Ajax call with the given options
        * options.type - Type of request
        * options.beforeSend - function to execute before sending the request
        * options.success - success callback
        * options.error - error callback
        * options.complete - complete callback - callled with a success or error
        * options.timeout - timeout to wait for the request
        * options.url - URL to make request against
        * options.contentType - HTTP Request Content Type
        * options.headers - Object of headers to set
        * options.dataType - Data type of request
        * options.data - data to pass into request.  $.param is called on objects
            ```
            var options={
            type:"GET",
            success:function(data){},
            url:"mypage.php",
            data:{bar:'bar'},
            }
            $.ajax(options);
            ```

        * @param {Object} options
        * @title $.ajax(options)
        */
        $.ajax = function(options) {
            var xhr;
            try {
				
                var settings = options || {};
                for (var key in ajaxSettings) {
                    if (typeof(settings[key]) == 'undefined')
                        settings[key] = ajaxSettings[key];
                }
                
                if (!settings.url)
                    settings.url = window.location;
                if (!settings.contentType)
                    settings.contentType = "application/x-www-form-urlencoded";
                if (!settings.headers)
                    settings.headers = {};
               
                if(!('async' in settings)||settings.async!==false)
                    settings.async=true;
                
                if (!settings.dataType)
                    settings.dataType = "text/html";
                else {
                    switch (settings.dataType) {
                        case "script":
                            settings.dataType = 'text/javascript, application/javascript';
                            break;
                        case "json":
                            settings.dataType = 'application/json';
                            break;
                        case "xml":
                            settings.dataType = 'application/xml, text/xml';
                            break;
                        case "html":
                            settings.dataType = 'text/html';
                            break;
                        case "text":
                            settings.dataType = 'text/plain';
                            break;
                        default:
                            settings.dataType = "text/html";
                            break;
                        case "jsonp":
                            return $.jsonP(options);
                            break;
                    }
                }
                if ($.isObject(settings.data))
                    settings.data = $.param(settings.data);
                if (settings.type.toLowerCase() === "get" && settings.data) {
                    if (settings.url.indexOf("?") === -1)
                        settings.url += "?" + settings.data;
                    else
                        settings.url += "&" + settings.data;
                }
                
                if (/=\?/.test(settings.url)) {
                    return $.jsonP(settings);
                }
                if (settings.crossDomain === null) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                    RegExp.$2 != window.location.host;
                
                if(!settings.crossDomain)
                    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers);
                var abortTimeout;
                var context = settings.context;
                var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
				
				//ok, we are really using xhr
				xhr = new window.XMLHttpRequest();
				
				
                xhr.onreadystatechange = function() {
                    var mime = settings.dataType;
                    if (xhr.readyState === 4) {
                        clearTimeout(abortTimeout);
                        var result, error = false;
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0&&protocol=='file:') {
                            if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                                try {
                                    result = JSON.parse(xhr.responseText);
                                } catch (e) {
                                    error = e;
                                }
                            } else if (mime === 'application/xml, text/xml') {
                                result = xhr.responseXML;
                            } 
                            else if(mime=="text/html"){
                                result=xhr.responseText;
                                $.parseJS(result);
                            }
                            else
                                result = xhr.responseText;
                            //If we're looking at a local file, we assume that no response sent back means there was an error
                            if(xhr.status===0&&result.length===0)
                                error=true;
                            if (error)
                                settings.error.call(context, xhr, 'parsererror', error);
                            else {
                                settings.success.call(context, result, 'success', xhr);
                            }
                        } else {
                            error = true;
                            settings.error.call(context, xhr, 'error');
                        }
                        settings.complete.call(context, xhr, error ? 'error' : 'success');
                    }
                };
                xhr.open(settings.type, settings.url, settings.async);
				if (settings.withCredentials) xhr.withCredentials = true;
                
                if (settings.contentType)
                    settings.headers['Content-Type'] = settings.contentType;
                for (var name in settings.headers)
                    xhr.setRequestHeader(name, settings.headers[name]);
                if (settings.beforeSend.call(context, xhr, settings) === false) {
                    xhr.abort();
                    return false;
                }
                
                if (settings.timeout > 0)
                    abortTimeout = setTimeout(function() {
                        xhr.onreadystatechange = empty;
                        xhr.abort();
                        settings.error.call(context, xhr, 'timeout');
                    }, settings.timeout);
                xhr.send(settings.data);
            } catch (e) {
            	// General errors (e.g. access denied) should also be sent to the error callback
                0;
            	settings.error.call(context, xhr, 'error', e);
            }
            return xhr;
        };
        
        
        /**
        * Shorthand call to an Ajax GET request
            ```
            $.get("mypage.php?foo=bar",function(data){});
            ```

        * @param {String} url to hit
        * @param {Function} success
        * @title $.get(url,success)
        */
        $.get = function(url, success) {
            return this.ajax({
                url: url,
                success: success
            });
        };
        /**
        * Shorthand call to an Ajax POST request
            ```
            $.post("mypage.php",{bar:'bar'},function(data){});
            ```

        * @param {String} url to hit
        * @param {Object} [data] to pass in
        * @param {Function} success
        * @param {String} [dataType]
        * @title $.post(url,[data],success,[dataType])
        */
        $.post = function(url, data, success, dataType) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            if (dataType === undefined)
                dataType = "html";
            return this.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: dataType,
                success: success
            });
        };
        /**
        * Shorthand call to an Ajax request that expects a JSON response
            ```
            $.getJSON("mypage.php",{bar:'bar'},function(data){});
            ```

        * @param {String} url to hit
        * @param {Object} [data]
        * @param {Function} [success]
        * @title $.getJSON(url,data,success)
        */
        $.getJSON = function(url, data, success) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                success: success,
                dataType: "json"
            });
        };

        /**
        * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
            ```
            var object={
            foo:'foo',
            bar:'bar'
            }
            var kvp=$.param(object,'data');
            ```

        * @param {Object} object
        * @param {String} [prefix]
        * @return {String} Key/value pair representation
        * @title $.param(object,[prefix];
        */
        $.param = function(object, prefix) {
            var str = [];
            if (object instanceof $jqm) {
                object.each(function() {
                    var k = prefix ? prefix + "[]" : this.id, 
                    v = this.value;
                    str.push((k) + "=" + encodeURIComponent(v));
                });
            } else {
                for (var p in object) {
                    var k = prefix ? prefix + "[" + p + "]" : p, 
                    v = object[p];
                    str.push($.isObject(v) ? $.param(v, k) : (k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };
        /**
        * Used for backwards compatibility.  Uses native JSON.parse function
            ```
            var object=$.parseJSON("{\"bar\":\"bar\"}");
            ```

        * @params {String} string
        * @return {Object}
        * @title $.parseJSON(string)
        */
        $.parseJSON = function(string) {
            return JSON.parse(string);
        };
        /**
        * Helper function to convert XML into  the DOM node representation
            ```
            var xmlDoc=$.parseXML("<xml><foo>bar</foo></xml>");
            ```

        * @param {String} string
        * @return {Object} DOM nodes
        * @title $.parseXML(string)
        */
        $.parseXML = function(string) {
            return (new DOMParser).parseFromString(string, "text/xml");
        };
        /**
         * Helper function to parse the user agent.  Sets the following
         * .os.webkit
         * .os.android
         * .os.ipad
         * .os.iphone
         * .os.webos
         * .os.touchpad
         * .os.blackberry
         * .os.opera
         * .os.fennec
         * .os.ie
         * .os.ieTouch
         * .os.supportsTouch
         * .os.playbook
         * .feat.nativetouchScroll
         * @api private
         */
        function detectUA($, userAgent) {
            $.os = {};
            $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
            $.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
			$.os.androidICS = $.os.android && userAgent.match(/(Android)\s4/) ? true : false;
            $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
            $.os.iphone = !$.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
            $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
            $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/) ? true : false;
            $.os.ios = $.os.ipad || $.os.iphone;
			$.os.playbook = userAgent.match(/PlayBook/) ? true : false;
            $.os.blackberry = $.os.playbook || userAgent.match(/BlackBerry/) ? true : false;
			$.os.blackberry10 = $.os.blackberry && userAgent.match(/Safari\/536/) ? true : false;
            $.os.chrome = userAgent.match(/Chrome/) ? true : false;
			$.os.opera = userAgent.match(/Opera/) ? true : false;
            $.os.fennec = userAgent.match(/fennec/i) ? true :userAgent.match(/Firefox/)?true: false;
            $.os.ie = userAgent.match(/MSIE 10.0/i)?true:false;
            $.os.ieTouch=$.os.ie&&userAgent.toLowerCase().match(/touch/i)?true:false;
            $.os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
            //features
            $.feat = {};
            var head=document.documentElement.getElementsByTagName("head")[0];
            $.feat.nativeTouchScroll =  typeof(head.style["-webkit-overflow-scrolling"])!=="undefined" || $.os.chrome;
            $.feat.cssPrefix=$.os.webkit?"Webkit":$.os.fennec?"Moz":$.os.ie?"ms":$.os.opera?"O":"";
            $.feat.cssTransformStart=!$.os.opera?"3d(":"(";
            $.feat.cssTransformEnd=!$.os.opera?",0)":")";
            if($.os.android&&!$.os.webkit)
                $.os.android=false;
        }

        detectUA($, navigator.userAgent);
        $.__detectUA = detectUA; //needed for unit tests
        if (typeof String.prototype.trim !== 'function') {
            /**
             * Helper function for iOS 3.1.3
             */
            String.prototype.trim = function() {
                this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, '');
                return this
            };
        }
        
        /**
         * Utility function to create a psuedo GUID
           ```
           var id= $.uuid();
           ```
         * @title $.uuid
         */
        $.uuid = function () {
            var S4 = function () {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        };

        /**
         * Gets the css matrix, or creates a fake one
           ```
           $.getCssMatrix(domElement)
           ```
           @returns matrix with postion
           */
        $.getCssMatrix=function(ele){
            if(ele==undefined) return window.WebKitCSSMatrix||window.MSCSSMatrix|| {a:0,b:0,c:0,d:0,e:0,f:0};
            try{
                if(window.WebKitCSSMatrix)
                    return new WebKitCSSMatrix(window.getComputedStyle(ele).webkitTransform)
                else if(window.MSCSSMatrix)
                    return new MSCSSMatrix(window.getComputedStyle(ele).transform);
                else {
                    //fake css matrix
                    var mat = window.getComputedStyle(ele)[$.feat.cssPrefix+'Transform'].replace(/[^0-9\-.,]/g, '').split(',');
                    return {a:+mat[0],b:+mat[1],c:+mat[2],d:+mat[3], e: +mat[4], f:+mat[5]};
                }
            }
            catch(e){
                return {a:0,b:0,c:0,d:0,e:0,f:0};
            }
        }

        
        /**
         Zepto.js events
         @api private
         */

        //The following is modified from Zepto.js / events.js
        //We've removed depricated jQuery events like .live and allow anonymous functions to be removed
        var handlers = {}, 
        _jqmid = 1;
        /**
         * Gets or sets the expando property on a javascript element
         * Also increments the internal counter for elements;
         * @param {Object} element
         * @return {Int} jqmid
         * @api private
         */
        function jqmid(element) {
            return element._jqmid || (element._jqmid = _jqmid++);
        }
        /**
         * Searches through a local array that keeps track of event handlers for proxying.
         * Since we listen for multiple events, we match up the event, function and selector.
         * This is used to find, execute, remove proxied event functions
         * @param {Object} element
         * @param {String} [event]
         * @param {Function} [function]
         * @param {String|Object|Array} [selector]
         * @return {Function|null} handler function or false if not found
         * @api private
         */
        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns)
                var matcher = matcherFor(event.ns);
            return (handlers[jqmid(element)] || []).filter(function(handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && "" + handler.fn === "" + fn)) && (!selector || handler.selector == selector);
            });
        }
        /**
         * Splits an event name by "." to look for namespaces (e.g touch.click)
         * @param {String} event
         * @return {Object} an object with the event name and namespace
         * @api private
         */
        function parse(event) {
            var parts = ('' + event).split('.');
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(' ')
            };
        }
        /**
         * Regular expression checker for event namespace checking
         * @param {String} namespace
         * @return {Regex} regular expression
         * @api private
         */
        function matcherFor(ns) {
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
        }

        /**
         * Utility function that will loop through events that can be a hash or space delimited and executes the function
         * @param {String|Object} events
         * @param {Function} fn
         * @param {Iterator} [iterator]
         * @api private
         */
        function eachEvent(events, fn, iterator) {
            if ($.isObject(events))
                $.each(events, iterator);
            else
                events.split(/\s/).forEach(function(type) {
                    iterator(type, fn)
                });
        }

        /**
         * Helper function for adding an event and creating the proxy handler function.
         * All event handlers call this to wire event listeners up.  We create proxy handlers so they can be removed then.
         * This is needed for delegate/on
         * @param {Object} element
         * @param {String|Object} events
         * @param {Function} function that will be executed when event triggers
         * @param {String|Array|Object} [selector]
         * @param {Function} [getDelegate]
         * @api private
         */
        function add(element, events, fn, selector, getDelegate) {
            var id = jqmid(element), 
            set = (handlers[id] || (handlers[id] = []));
            eachEvent(events, fn, function(event, fn) {
                var delegate = getDelegate && getDelegate(fn, event), 
                callback = delegate || fn;
                var proxyfn = function(event) {
                    var result = callback.apply(element, [event].concat(event.data));
                    if (result === false)
                        event.preventDefault();
                    return result;
                };
                var handler = $.extend(parse(event), {
                    fn: fn,
                    proxy: proxyfn,
                    selector: selector,
                    del: delegate,
                    i: set.length
                });
                set.push(handler);
                element.addEventListener(handler.e, proxyfn, false);
            });
            //element=null;
        }

        /**
         * Helper function to remove event listeners.  We look through each event and then the proxy handler array to see if it exists
         * If found, we remove the listener and the entry from the proxy array.  If no function is specified, we remove all listeners that match
         * @param {Object} element
         * @param {String|Object} events
         * @param {Function} [fn]
         * @param {String|Array|Object} [selector]
         * @api private
         */
        function remove(element, events, fn, selector) {
            
            var id = jqmid(element);
            eachEvent(events || '', fn, function(event, fn) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i];
                    element.removeEventListener(handler.e, handler.proxy, false);
                });
            });
        }
        
        $.event = {
            add: add,
            remove: remove
        };

        /**
        * Binds an event to each element in the collection and executes the callback
            ```
            $().bind('click',function(){console.log('I clicked '+this.id);});
            ```

        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().bind(event,callback)
        */
        $.fn.bind = function(event, callback) {
            for (var i = 0; i < this.length; i++) {
                add(this[i], event, callback);
            }
            return this;
        };
        /**
        * Unbinds an event to each element in the collection.  If a callback is passed in, we remove just that one, otherwise we remove all callbacks for those events
            ```
            $().unbind('click'); //Unbinds all click events
            $().unbind('click',myFunc); //Unbinds myFunc
            ```

        * @param {String|Object} event
        * @param {Function} [callback]
        * @return {Object} jqMobi object
        * @title $().unbind(event,[callback]);
        */
        $.fn.unbind = function(event, callback) {
            for (var i = 0; i < this.length; i++) {
                remove(this[i], event, callback);
            }
            return this;
        };

        /**
        * Binds an event to each element in the collection that will only execute once.  When it executes, we remove the event listener then right away so it no longer happens
            ```
            $().one('click',function(){console.log('I was clicked once');});
            ```

        * @param {String|Object} event
        * @param {Function} [callback]
        * @return jqMobi object
        * @title $().one(event,callback);
        */
        $.fn.one = function(event, callback) {
            return this.each(function(i, element) {
                add(this, event, callback, null, function(fn, type) {
                    return function() {
                        var result = fn.apply(element, arguments);
                        remove(element, type, fn);
                        return result;
                    }
                });
            });
        };
        
         /**
         * internal variables
         * @api private
         */
        
        var returnTrue = function() {
            return true
        }, 
        returnFalse = function() {
            return false
        }, 
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        };
        /**
         * Creates a proxy function for event handlers. 
		 * As "some" browsers dont support event.stopPropagation this call is bypassed if it cant be found on the event object.
         * @param {String} event
         * @return {Function} proxy
         * @api private
         */
        function createProxy(event) {
            var proxy = $.extend({
                originalEvent: event
            }, event);
            $.each(eventMethods, function(name, predicate) {
                proxy[name] = function() {
                    this[predicate] = returnTrue;					
					if (name == "stopImmediatePropagation" || name == "stopPropagation"){
						event.cancelBubble = true;
						if(!event[name])
							return;
					}
					return event[name].apply(event, arguments);
                };
                proxy[predicate] = returnFalse;
            })
            return proxy;
        }

        /**
        * Delegate an event based off the selector.  The event will be registered at the parent level, but executes on the selector.
            ```
            $("#div").delegate("p",'click',callback);
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().delegate(selector,event,callback)
        */
        $.fn.delegate = function(selector, event, callback) {
            for (var i = 0; i < this.length; i++) {
                var element = this[i];
                add(element, event, callback, selector, function(fn) {
                    return function(e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
                        if (match) {
                            evt = $.extend(createProxy(e), {
                                currentTarget: match,
                                liveFired: element
                            });
                            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
                        }
                    }
                });
            }
            return this;
        };

        /**
        * Unbinds events that were registered through delegate.  It acts upon the selector and event.  If a callback is specified, it will remove that one, otherwise it removes all of them.
            ```
            $("#div").undelegate("p",'click',callback);//Undelegates callback for the click event
            $("#div").undelegate("p",'click');//Undelegates all click events
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().undelegate(selector,event,[callback]);
        */
        $.fn.undelegate = function(selector, event, callback) {
            for (var i = 0; i < this.length; i++) {
                remove(this[i], event, callback, selector);
            }
            return this;
        };

        /**
        * Similar to delegate, but the function parameter order is easier to understand.
        * If selector is undefined or a function, we just call .bind, otherwise we use .delegate
            ```
            $("#div").on("click","p",callback);
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().on(event,selector,callback);
        */
        $.fn.on = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.bind(event, selector) : this.delegate(selector, event, callback);
        };
        /**
        * Removes event listeners for .on()
        * If selector is undefined or a function, we call unbind, otherwise it's undelegate
            ```
            $().off("click","p",callback); //Remove callback function for click events
            $().off("click","p") //Remove all click events
            ```

        * @param {String|Object} event
        * @param {String|Array|Object} selector
        * @param {Sunction} callback
        * @return {Object} jqMobi object
        * @title $().off(event,selector,[callback])
        */
        $.fn.off = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.unbind(event, selector) : this.undelegate(selector, event, callback);
        };

        /**
        This triggers an event to be dispatched.  Usefull for emulating events, etc.
        ```
        $().trigger("click",{foo:'bar'});//Trigger the click event and pass in data
        ```

        * @param {String|Object} event
        * @param {Object} [data]
        * @return {Object} jqMobi object
        * @title $().trigger(event,data);
        */
        $.fn.trigger = function(event, data, props) {
            if (typeof event == 'string')
                event = $.Event(event, props);
            event.data = data;
            for (var i = 0; i < this.length; i++) {
                this[i].dispatchEvent(event)
            }
            return this;
        };

        /**
         * Creates a custom event to be used internally.
         * @param {String} type
         * @param {Object} [properties]
         * @return {event} a custom event that can then be dispatched
         * @title $.Event(type,props);
         */
        
        $.Event = function(type, props) {
            var event = document.createEvent('Events'), 
            bubbles = true;
            if (props)
                for (var name in props)
                    (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
            event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
            return event;
        };
		
        /* The following are for events on objects */
		/**
         * Bind an event to an object instead of a DOM Node 
           ```
           $.bind(this,'event',function(){});
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Function} function to execute
         * @title $.bind(object,event,function);
         */
		$.bind = function(object, ev, f){
			if(!object.__events) object.__events = {};
			if(!$.isArray(ev)) ev = [ev];
			for(var i=0; i<ev.length; i++){
				if(!object.__events[ev[i]]) object.__events[ev[i]] = [];
				object.__events[ev[i]].push(f);
			}
		};

        /**
         * Trigger an event to an object instead of a DOM Node 
           ```
           $.trigger(this,'event',arguments);
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Array} arguments
         * @title $.trigger(object,event,argments);
         */
		$.trigger = function(object, ev, args){
			var ret = true;
			if(!object.__events) return ret;
			if(!$.isArray(ev)) ev = [ev];
			if(!$.isArray(args)) args = [];
			for(var i=0; i<ev.length; i++){
				if(object.__events[ev[i]]){
					var evts = object.__events[ev[i]];
					for(var j = 0; j<evts.length; j++)
						if($.isFunction(evts[j]) && evts[j].apply(object, args)===false)
							ret = false;
				}
			}
			return ret;
		};
        /**
         * Unbind an event to an object instead of a DOM Node 
           ```
           $.unbind(this,'event',function(){});
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Function} function to execute
         * @title $.unbind(object,event,function);
         */
        $.unbind = function(object, ev, f){
			if(!object.__events) return;
			if(!$.isArray(ev)) ev = [ev];
			for(var i=0; i<ev.length; i++){
				if(object.__events[ev[i]]){
					var evts = object.__events[ev[i]];
					for(var j = 0; j<evts.length; j++){
                        if(f==undefined)
                            delete evts[j];
						if(evts[j]==f) {
							evts.splice(j,1);
							break;
						}
					}
				}
			}
		};
		
        
        /**
         * Creates a proxy function so you can change the 'this' context in the function
		 * Update: now also allows multiple argument call or for you to pass your own arguments
         ```
            var newObj={foo:bar}
            $("#main").bind("click",$.proxy(function(evt){console.log(this)},newObj);
			
			or 
			
			( $.proxy(function(foo, bar){console.log(this+foo+bar)}, newObj) )('foo', 'bar');
			
			or 
			
			( $.proxy(function(foo, bar){console.log(this+foo+bar)}, newObj, ['foo', 'bar']) )();
         ```
         
         * @param {Function} Callback
         * @param {Object} Context
         * @title $.proxy(callback,context);
         */
		$.proxy=function(f, c, args){
           	return function(){
				if(args) return f.apply(c, args);	//use provided arguments
               	return f.apply(c, arguments);	//use scope function call arguments
            }
		};

      
         /**
         * Removes listeners on a div and its children recursively
            ```
             cleanUpNode(node,kill)
            ```
         * @param {HTMLDivElement} the element to clean up recursively
         * @api private
         */
		function cleanUpNode(node, kill){
			//kill it before it lays eggs!
			if(kill && node.dispatchEvent){
	            var e = $.Event('destroy', {bubbles:false});
	            node.dispatchEvent(e);
			}
			//cleanup itself
            var id = jqmid(node);
            if(id && handlers[id]){
		    	for(var key in handlers[id])
		        	node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
            	delete handlers[id];
            }
		}
		function cleanUpContent(node, kill){
            if(!node) return;
			//cleanup children
            var children = node.childNodes;
            if(children && children.length > 0)
                for(var child in children)
                    cleanUpContent(children[child], kill);
			
			cleanUpNode(node, kill);
		}
		var cleanUpAsap = function(elements, kill){
        	for(var i=0;i<elements.length;i++){
            	cleanUpContent(elements[i], kill);
            }	
		};

        /**
         * Function to clean up node content to prevent memory leaks
           ```
           $.cleanUpContent(node,itself,kill)
           ```
         * @param {HTMLNode} node
         * @param {Bool} kill itself
         * @param {kill} Kill nodes
         * @title $.cleanUpContent(node,itself,kill)
         */
        $.cleanUpContent = function(node, itself, kill){
            if(!node) return;
			//cleanup children
            var cn = node.childNodes;
            if(cn && cn.length > 0){
				//destroy everything in a few ms to avoid memory leaks
				//remove them all and copy objs into new array
				$.asap(cleanUpAsap, {}, [slice.apply(cn, [0]), kill]);
            }
			//cleanUp this node
			if(itself) cleanUpNode(node, kill);
        }
		
        // Like setTimeout(fn, 0); but much faster
		var timeouts = [];
		var contexts = [];
		var params = [];
        /**
         * This adds a command to execute in the JS stack, but is faster then setTimeout
           ```
           $.asap(function,context,args)
           ```
         * @param {Function} function
         * @param {Object} context
         * @param {Array} arguments
         */
        $.asap = function(fn, context, args) {
			if(!$.isFunction(fn)) throw "$.asap - argument is not a valid function";
            timeouts.push(fn);
			contexts.push(context?context:{});
			params.push(args?args:[]);
			//post a message to ourselves so we know we have to execute a function from the stack 
            window.postMessage("jqm-asap", "*");
        }
		window.addEventListener("message", function(event) {
            if (event.source == window && event.data == "jqm-asap") {
                event.stopPropagation();
                if (timeouts.length > 0) {	//just in case...
                    (timeouts.shift()).apply(contexts.shift(), params.shift());
                }
            }
        }, true);

        /**
         * this function executes javascript in HTML.
           ```
           $.parseJS(content)
           ```
        * @param {String|DOM} content
        * @title $.parseJS(content);
        */
        var remoteJSPages={};
        $.parseJS= function(div) {
            if (!div)
                return;
            if(typeof(div)=="string"){
                var elem=document.createElement("div");
                elem.innerHTML=div;
                div=elem;
            }
            var scripts = div.getElementsByTagName("script");
            div = null;            
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.length > 0 && !remoteJSPages[scripts[i].src]) {
                    var doc = document.createElement("script");
                    doc.type = scripts[i].type;
                    doc.src = scripts[i].src;
                    document.getElementsByTagName('head')[0].appendChild(doc);
                    remoteJSPages[scripts[i].src] = 1;
                    doc = null;
                } else {
                    window.eval(scripts[i].innerHTML);
                }
            }
        };
		

        /**
        //custom events since people want to do $().click instead of $().bind("click")
        */

        ["click","keydown","keyup","keypress","submit","load","resize","change","select","error"].forEach(function(event){
            $.fn[event]=function(cb){
                return cb?this.bind(event,cb):this.trigger(event);
            }
        });
         /**
         * End of APIS
         * @api private
         */
        return $;

    })(window);
    '$' in window || (window.$ = jq);
    //Helper function used in jq.mobi.plugins.
    if (!window.numOnly) {
        window.numOnly = function numOnly(val) {
			if (val===undefined || val==='') return 0;
			if ( isNaN( parseFloat(val) ) ){
				if(val.replace){
					val = val.replace(/[^0-9.-]/, "");
				} else return 0;
			}  
            return parseFloat(val);
        }
    }
}

(function ($) {

  var default_hash = window.location.hash;
  var previous_target = default_hash;

  var ui = function () {
    //Custom transitions can be added to $.ui.availableTransitions
    this.availableTransitions = {};
    this.availableTransitions['default'] = this.availableTransitions['none'] = this.noTransition;
  };


  ui.prototype = {
    //custom ui_kit stuff

    //stock element id's and class names
    header_id: '#header',
    footer_id: '#footer',
    content_id: '#content',
    panel_id: '#panel',
    side_menu_id: '#side_menu',   //wrong
    left_button_id: '#top_left_button',
    right_button_id: '#top_right_button',
    active_footer_button_id: '',
    active_footer_class: 'active_footer_button',
    title_id: '#title',
    ui_kit_container_id: '#ui_kit',
    starting_panel_id:   '#starting_panel',


    //These get grabbed right away so if you swap a header for a new one,
    //you can still go back to the old one later
    default_header_content: '',
    default_footer_content: '',
    default_side_menu_content: '',


    last_click: '',
    cached_pages: [],

    pages_created: 0,
    pages_in_dom: 0,
    delete_queue: {},
    on_unload: null,
    //queue is like delete_queue['17'] = [div_id, other_div_id]
    //when pages_created reaches 17, it will execute delete_queue['17']

    //end

    load_content_queue: [],
    footer: "",
    header: "",
    ui_kit_container: "",
    left_button: "",
    history: [],
    homeDiv: "",
    screen_width: "",
    content_string: "",
    modal_window: "",
    custom_footer: false,
    default_footer: "",
    default_header: null,
    custom_menu: false,
    default_menu: "",
    _readyFunc: null,
    doing_transition: false,
    password_box: $.password_box ? new $.password_box() : false,
    select_box: $.select_box ? $.select_box : false,
    ajax_url: "",
    transition_effect: "fade",
    scrolling_divs: [],
    firstDiv: "",
    has_launched: false,
    launch_completed: false,
    active_div: '',
    custom_click_handler: "",
    menu_animation: null,
    side_menu_displayed: false,
    show_footer_menu: true,
    auto_launch: true,
    showBackbutton: true,
    left_button_text: "Back",
    reset_scrollers: true,
    load_default_hash: true,
    useAjaxCacheBuster: false,    //add "&cache=_rand_" to any ajax loaded link

    autoBoot: function () {
      if (this.auto_launch) {
        this.launch();
      }
    },


    //=============================================================
    //                 Start Launch
    //=============================================================


    //Launches ui_kit.
    //If Auto_launch is set to true, it gets called on DOMContentLoaded.
    //If false, you must manually invoke it
    launch: function () {

      //Make sure it can't be launched more than once
      if (this.has_launched) {
        return;
      }
      this.has_launched = true;

      var that = this;
      //get all the main divs into variables
      this.ui_kit_container = $(this.ui_kit_container_id);
      this.footer = $(this.footer_id).get(0);
      this.content_string = $(this.content_id).get(0);
      this.header = $(this.header_id).get(0);
      this.left_button = $(this.left_button_id).get(0);
      this.right_button = $(this.right_button_id).get(0);
      this.menu = $(this.side_menu_id).get(0);


      //add a click listener to the #ui_kit div
      this.ui_kit_container[0].addEventListener('click', function (e) {
        0;
        $.ui.checkAnchorClick(e, e.target);
      }, false);


      this.os_specific_fixes();
      //=======================================================================================
      //setting up the header and back button



      $(document).on("click", ".back_button", function () {
        0;
        that.go_back();
      });


        var starting_panel = $(this.starting_panel_id)[0];
        var tmp = starting_panel;
        var prevSibling = starting_panel.previousSibling;
        starting_panel.parentNode.removeChild(starting_panel);
        this.addDivAndScroll(tmp);
        $(this.starting_panel_id).insertAfter(prevSibling);
        this.firstDiv = $(this.starting_panel_id).get(0);

      starting_panel = null;


      if (this.firstDiv) {
        that = this;
        // Fix a bug in iOS where translate3d makes the content blurry
        this.active_div = this.firstDiv;
        if (this.scrolling_divs[this.active_div.id]) {
          this.scrolling_divs[this.active_div.id].enable();
        }

        var load_first_div = function () {
          //setup initial menu

            //TEMPORARY DISABLING. PLEASE FIX, THEN REENABLE
//          var firstMenu = $("nav").get();
//          if (firstMenu) {
//            that.default_menu = $(firstMenu).children().clone();
//            that.update_side_menu(that.default_menu);
//          }



          //get default header in case we need it later if you swap headers
          that.default_header = $("#header").children().clone();


          //go to active_div
          var firstPanelId = that.get_panel_id_from_hash(default_hash);
          //that.history=[{target:'#'+that.firstDiv.id}];   //set the first id as origin of path
          if (firstPanelId.length > 0 && that.load_default_hash && firstPanelId !== ("#" + that.firstDiv.id) && $(firstPanelId).length > 0) {
            that.load_content(default_hash, true, false, 'none'); //load the active page as a clear_history with no transition
          } else {
            previous_target = "#" + that.firstDiv.id;
            that.loadContentData(that.firstDiv); //load the info off the first panel

            that.firstDiv.style.display = "block";
            $("#header #left_button").css("visibility", "hidden");
          }

          that.launch_completed = true;

          //trigger ui ready
          $(document).trigger("$.ui.ready");
          //trigger moved to after current_user is loaded
          //remove splash screen
        };

          load_first_div();

      }
      that = this;
      $.bind(that, "content-loaded", function () {
        if (that.load_content_queue.length > 0) {
          var tmp = that.load_content_queue.splice(0, 1)[0];
          that.load_content(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4]);
        }
      });
      if (window.navigator.standalone) {
        this.blockPageScroll();
      }
      this.topClickScroll();

    },


    //=============================================================
    //                 End Launch
    //=============================================================


    toggle_visibility: function (element_id, visible) {
      if (visible === true) {
        $(element_id).show();
        return;
      }
      else if (visible === false) {
        $(element_id).hide();
        return;
      }
      $(element_id).toggle();
    },

    dispose: function (element_id) {
      //replace all images with src='tiny.png'
      //removeChild
    },

    //The ID of the original element never changes as the new
    //elements children replace the children of the original element
    set_element: function set_element(old_div, new_div) {
      if (new_div && new_div !== old_div) {
        old_div = $(old_div);
        old_div.html($(new_div).html());
        old_div.children().show();
      }
      else if(new_div === old_div){
        $(old_div).children().show();
      }
      else if(!new_div) {
        $(old_div).children().hide();
      }
    },

    set_active_footer_button: function (div_id) {
      //this has to be a search by id for best speed
      $(this.current_footer_button_id).removeClass(this.active_footer_class);
      $(div_id).addClass(this.active_footer_class);
      this.current_footer_button_id = div_id;
      //$(div_id).addClass(this.active_footer_class).siblings().removeClass(this.active_footer_class);

    },
/*
    set_footer: function (div_id) {
        console.log('div_id %s', div_id);
      if(div_id){
        this.set_element(this.footer_id, div_id);
        this.footer_id = div_id;
        this.toggle_footer_menu(true);
      }
      else{
        this.toggle_footer_menu(false);
      }
    },

*/

    set_footer: function (div_id) {
        if(div_id){
            $(this.footer_id).hide();
            this.footer_id = div_id;
            $(div_id).show();
        }
        else {
            $(this.footer_id).hide();
        }
    },
    
    
    
    toggle_footer_menu: function (force) {
      if ($(this.footer_id).css("display") !== "none" && ((force !== undefined && force !== true) || force === undefined)) {
        $("#content").css("bottom", "0px");
        $(this.footer_id).hide();
      }
      else if (force === undefined || (force !== undefined && force === true)) {
        $(this.footer_id).show();
        $("#content").css("bottom", $(this.footer_id).css("height"));
      }
    },


    set_header: function (div_id) {
    if(div_id){
      this.set_element(this.header_id, div_id);
      this.toggle_header_menu(true);
    }
    else{
      this.toggle_header_menu(false);
}
    },

    toggle_header_menu: function (force) {
      if ($("#header").css("display") !== "none" && ((force !== undefined && force !== true) || force === undefined)) {
//        $("#content").css("top", "0px");
        $("#header").hide();
      }
      else if (force === undefined || (force !== undefined && force === true)) {
        $(this.header_id).show();
//        var val = numOnly($(this.header_id).css("height"));
//        $(this.content_id).css("top", val + 'px');
      }
    },


    set_left_button: function (div_id) {
      this.set_element(this.left_button_id, div_id);
    },

    set_right_button: function (div_id) {
      this.set_element(this.right_button_id, div_id);
    },


    os_specific_fixes: function () {

      var that = this;
      //enter-edit scroll padding fix
      //focus scroll adjust fix
      var enterEditEl = null;
      //on enter-edit keep a reference of the actioned element
      $.bind($.touch_layer, 'enter-edit', function (element) {
        enterEditEl = element;
      });
      //enter-edit-reshape panel padding and scroll adjust
      $.bind($.touch_layer, 'enter-edit-reshape', function () {
        //onReshape UI fixes
        //check if focused element is within active panel
        var jQel = $(enterEditEl);
        var jQactive = jQel.closest(that.active_div);
        if (jQactive && jQactive.size() > 0) {
          if ($.os.ios || $.os.chrome) {
            var paddingTop, paddingBottom;
            if (document.body.scrollTop) {
              paddingTop = document.body.scrollTop - jQactive.offset().top;
            } else {
              paddingTop = 0;
            }
            //not exact, can be a little above the actual value
            //but we haven't found an accurate way to measure it and this is the best so far
            paddingBottom = jQactive.offset().bottom - jQel.offset().bottom;
            that.scrolling_divs[that.active_div.id].setPaddings(paddingTop, paddingBottom);

          } else if ($.os.android || $.os.blackberry) {
            var elPos = jQel.offset();
            var containerPos = jQactive.offset();
            if (elPos.bottom > containerPos.bottom && elPos.height < containerPos.height) {
              //apply fix
              that.scrolling_divs[that.active_div.id].scrollToItem(jQel, 'bottom');
            }
          }
        }
      });

      if ($.os.ios) {
        $.bind($.touch_layer, 'exit-edit-reshape', function () {
          that.scrolling_divs[that.active_div.id].setPaddings(0, 0);
        });
      }
    },

    css3animate: function (element, options) {
      element = $(element);
      return element.css3Animate(options);
    },

    actionsheet: function (options) {
      return $("#ui_kit").actionsheet(options);
    },

    popup: function (options) {
      return $("#ui_kit").popup(options);
    },

    // function to fire when jqUi is ready and completed launch
    ready: function (param) {
      if (this.launch_completed){

        param();
      }
      else{
        document.addEventListener("$.ui.ready", function (e) {
          param();
          this.removeEventListener('$.ui.ready', arguments.callee);
        }, false);
      }
    },


    go_back: function () {
      if (this.history.length > 0) {
        this.history.pop();                        //remove the current page
        var previous_page = this.history.pop();    //get the previous page
        $.mvc.route(previous_page);
      }
    },

    clear_history: function () {
      this.history = [];
    },

    get_panel_id_from_hash: function (hash) {
      var firstSlash = hash.indexOf('/');
      return firstSlash === -1 ? hash : hash.substring(0, firstSlash);
    },



    update_content_div: function (id, content_string) {
      id = "#" + id.replace("#", "");
      var element = $(id).get(0);
      if (!element){
        return;
      }
      var newDiv = document.createElement("div");
      newDiv.innerHTML = content_string;
      //$(newDiv).children('.panel') doesnt seem to be right. test it
      //debugger;
      if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0){
        newDiv = $(newDiv).children('.panel').get();
      }


      if (element.getAttribute("js-scrolling") && element.getAttribute("js-scrolling").toLowerCase() === "yes") {
        $.cleanUpContent(element.childNodes[0], false, true);
        element.childNodes[0].innerHTML = content_string;
      }
      else {
        $.cleanUpContent(element, false, true);
        element.innerHTML = content_string;
      }
      if ($(newDiv).title){
        element.title = $(newDiv).title;
      }
    },

    //Dynamically create a new panel on the fly.  It wires events, creates the scroller, applies Android fixes, etc.
    add_content_div: function (element, content_string, title, refresh) {
      element = typeof (element) !== "string" ? element : element.indexOf("#") === -1 ? "#" + element : element;
      var myEl = $(element).get(0);
      var newDiv, newId;
      if (!myEl) {
        newDiv = document.createElement("div");
        newDiv.innerHTML = content_string;
        if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0){
          newDiv = $(newDiv).children('.panel').get();
        }
        if (!newDiv.title && title){
          //debugger;
          newDiv.title = title;
        }
        newId = (newDiv.id) ? newDiv.id : element.replace("#", ""); //figure out the new id - either the id from the loaded div.panel or the crc32 hash
        newDiv.id = newId;
      }
      else {
        newDiv = myEl;
      }
      newDiv.className = "panel";
      newId = newDiv.id;
      this.addDivAndScroll(newDiv, refresh);
      myEl = null;
      newDiv = null;
      return newId;
    },


    //This is called to initiate a transition
    //We can pass in a hash+id or URL and then we parse the panel for additional functions
    //clear_history = true = resetHistory, back = true = back click
    load_content: function (target, clear_history, back, transition, anchor) {

      if (this.doing_transition) {
        this.load_content_queue.push([target, clear_history, back, transition, anchor]);
      }
      else if (target.length === 0) {
      return;
      }
      else {
        this.loadDiv(target, clear_history, back, transition);
      }
    },

    //This is called internally by load_content.  Here we are loading a div instead of an Ajax link
    loadDiv: function (new_panel_id, clear_history, back, transition) {

      //replace any # to prevent browser issues
      new_panel_id = new_panel_id.replace("#", "");
      var slashIndex = new_panel_id.indexOf('/');
      if (slashIndex !== -1) {
        // Ignore everything after the slash for loading
        new_panel_id = new_panel_id.substr(0, slashIndex);
      }

      var new_panel = $('#' + new_panel_id).get(0);

      if (!new_panel) {
        return 0;
      }
      this.transition_effect = transition;
      var current_panel = this.active_div;


      if (current_panel === new_panel){ //prevent it from going to itself
        return;
      }
      if (clear_history) {
        this.clear_history();
      }

      this.doing_transition = true;

      current_panel.style.display = "block";
      new_panel.style.display = "block";

      this.runTransition(transition, current_panel, new_panel, back);

      //Let's check if it has a function to run to update the data
      //this.parsePanelFunctions(what, current_panel);

      //Need to call after parsePanelFunctions, since new headers can override
      this.loadContentData(new_panel);
      var that = this;
      setTimeout(function () {
        if (that.scrolling_divs[current_panel.id]) {
          that.scrolling_divs[current_panel.id].disable();
        }
      }, 200);

    },

    //This is called internally by loadDiv.  This sets up the back button
    // in the header and scroller for the panel
    loadContentData: function (new_panel) {
      if (new_panel.title) {
        $(this.title_id).html(new_panel.title);
      }
      this.active_div = new_panel;
      if (this.scrolling_divs[this.active_div.id]) {
        this.scrolling_divs[this.active_div.id].enable(this.reset_scrollers);
      }

    },

    runTransition: function (transition, current_panel, new_panel, back) {
      if (!this.availableTransitions[transition]){
        transition = 'default';
      }
      this.availableTransitions[transition].call(this, current_panel, new_panel, back);
    },


    //sets up scrolling for a div
    addDivAndScroll: function (tmp, refreshPull) {
      var jsScroll = false;
      var scrollEl;
      var overflowStyle = tmp.style.overflow;
      var hasScroll = overflowStyle !== 'hidden' && overflowStyle !== 'visible';
      var container = this.content_string;
      //sets up scroll when required and not supported
      if (!$.feat.nativeTouchScroll && hasScroll) {
        tmp.setAttribute("js-scrolling", "yes");
      }
      if (tmp.getAttribute("js-scrolling") && tmp.getAttribute("js-scrolling").toLowerCase() === "yes") {
        jsScroll = true;
        hasScroll = true;
      }
      if (tmp.getAttribute("scrolling") && tmp.getAttribute("scrolling") === 'no') {
        hasScroll = false;
        jsScroll = false;
        tmp.removeAttribute("js-scrolling");
      }
      if (!jsScroll) {
        container.appendChild(tmp);
        scrollEl = tmp;
        tmp.style['-webkit-overflow-scrolling'] = 'none';
      }
      else {
        //WE need to clone the div so we keep events
        scrollEl = tmp.cloneNode(false);
        tmp.title = null;
        tmp.id = null;
        $(tmp).replaceClass("panel", "jqmScrollPanel");
        scrollEl.appendChild(tmp);
        container.appendChild(scrollEl);
        if (this.select_box !== false) {
          this.select_box.getOldSelects(scrollEl.id);
        }
        if (this.password_box !== false) {
          this.password_box.getOldPasswords(scrollEl.id);
        }
      }
      if (hasScroll) {
        this.scrolling_divs[scrollEl.id] = ($(tmp).scroller({
          scrollBars: true,
          verticalScroll: true,
          horizontalScroll: false,
          vScrollCSS: "jqmScrollbar",
          refresh: refreshPull,
          useJsScroll: jsScroll,
          noParent: !jsScroll,
          autoEnable: false //dont enable the events unnecessarily
        }));
      }
      tmp = null;
      scrollEl = null;
    },

    scrollToTop: function (id) {
      if (this.scrolling_divs[id]) {
        this.scrolling_divs[id].scrollToTop("300ms");
      }
    },

    scrollToBottom: function (id) {
      if (this.scrolling_divs[id]) {
        this.scrolling_divs[id].scrollToBottom("300ms");
      }
    },

    //Simulates the click and scroll to top of browser
    topClickScroll: function () {
      document.getElementById("header").addEventListener("click", function (e) {
        if (e.clientY <= 15 && e.target.nodeName.toLowerCase() === "h1"){ //hack - the title spans the whole width of the header
          $.ui.scrolling_divs[$.ui.active_div.id].scrollToTop("100");
        }
      });
    },

    blockPageScroll: function () {
      $("#ui_kit #header").bind("touchmove", function (e) {
        e.preventDefault();
      });
    },

    //This is the default transition.  It simply shows the new panel and hides the old
    noTransition: function (current_panel, new_panel) {
      new_panel.style.display = "block";
      current_panel.style.display = "block";
      var that = this;
      that.clearAnimations(new_panel);
      that.css3animate(current_panel, {
        x: "0%",
        y: 0
      });
      that.finishTransition(current_panel);
      new_panel.style.zIndex = 2;
      current_panel.style.zIndex = 1;
    },

    //This must be called at the end of every transition to hide the old div and
    // reset the doing_transition variable
    finishTransition: function (current_panel, new_panel) {
      current_panel.style.display = 'none';
      this.doing_transition = false;
      if (new_panel){
        this.clearAnimations(new_panel);
      }
      if (current_panel){
        this.clearAnimations(current_panel);
      }
      $.trigger(this, "content-loaded");
    },

    //Must be called at the end of every transition for performance and native scroll
    clearAnimations: function (in_view_div_object) {
      in_view_div_object.style[$.feat.cssPrefix + 'Transform'] = "none";
      in_view_div_object.style[$.feat.cssPrefix + 'Transition'] = "none";
    }
  };


  $.ui = new ui();
})(jq);





(function($){

  //lookup for a clicked anchor recursively and fire UI own actions when applicable
  $.ui.checkAnchorClick = function (e, theTarget) {
    if (theTarget === ($.ui.ui_kit_container_id)) {
      return;
    }
    //if the item clicked is not an <a> then bubble up to see if we find it
    if (theTarget.tagName && theTarget.tagName.toLowerCase() !== 'a' && theTarget.parentNode) {
      return $.ui.checkAnchorClick(e, theTarget.parentNode);
    }
    if (theTarget.tagName && theTarget.tagName.toLowerCase() === "a") {
      if ($.mvc.route(theTarget)) {
        return e.preventDefault();
      }
    }
    //we didn't catch the link, it must be outbound
  };

})(jq);




/**
 * jq.web.actionsheet - a actionsheet for html5 mobile apps
 * Copyright 2012 - Intel
 */
(function($) {
  $.fn["actionsheet"] = function(options) {
    var tmp;
    for (var i = 0; i < this.length; i++) {
      tmp = new actionsheet(this[i], options);
    }
    return this.length == 1 ? tmp : this;
  };
  var actionsheet = (function() {
    var actionsheet = function(element_id, options) {
      if (typeof element_id == "string" || element_id instanceof String) {
        this.element = document.getElementById(element_id);
      } else {
        this.element = element_id;
      }
      if (!this.element) {
        alert("Could not find element for actionsheet " + element_id);
        return;
      }

      if (this instanceof actionsheet) {
        if(typeof(options)=="object"){
          for (var property in options) {
            this[property] = options[property];
          }
        }
      } else {
        return new actionsheet(element_id, options);
      }

      try {
        var that = this;
        var markStart = '<div id="jq_actionsheet"><div style="width:100%">';
        var markEnd = '</div></div>';
        var markup;
        if (typeof options == "string") {
          markup = $(markStart + options +"<a href='javascript:;' class='cancel'>Cancel</a>"+markEnd);
        } else if (typeof options == "object") {
          markup = $(markStart + markEnd);
          var container = $(markup.children().get());
          options.push({text:"Cancel",cssClasses:"cancel"});
          for (var i = 0; i < options.length; i++) {
            var item = $('<a href="javascript:;" >' + (options[i].text || "TEXT NOT ENTERED") + '</a>');
            item[0].onclick = (options[i].handler || function() {});
            if (options[i].cssClasses && options[i].cssClasses.length > 0)
              item.addClass(options[i].cssClasses);
            container.append(item);
          }
        }
        $(element_id).find("#jq_actionsheet").remove();
        $(element_id).find("#jq_action_mask").remove();
        actionsheetEl = $(element_id).append(markup);

        markup.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
        markup.css($.feat.cssPrefix+"Transform",  "translate"+$.feat.cssTransformStart+"0,0"+$.feat.cssTransformEnd);
        markup.css("top",window.innerHeight+"px");
        this.element.style.overflow = "hidden";
        markup.on("click", "a",function(){that.hideSheet()});
        this.activeSheet=markup;
        $(element_id).append('<div id="jq_action_mask" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;z-index:9998;background:rgba(0,0,0,.4)"/>');
        setTimeout(function(){
          markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";
          markup.css($.feat.cssPrefix+"Transform", "translate"+ $.feat.cssTransformStart+"0,"+(-(markup.height()))+"px"+$.feat.cssTransformEnd);
        },10);
      } catch (e) {
        alert("error adding actionsheet" + e);
      }
    };
    actionsheet.prototype = {
      activeSheet:null,
      hideSheet: function() {
        var that=this;
        this.activeSheet.off("click","a",function(){that.hideSheet()});
        $(this.element).find("#jq_action_mask").remove();
        this.activeSheet.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
        var markup = this.activeSheet;
        var theEl = this.element;
        setTimeout(function(){

          markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";

          markup.css($.feat.cssPrefix+"Transform", "translate"+$.feat.cssTransformStart+"0,0px"+$.feat.cssTransformEnd);
          setTimeout(function(){
            markup.remove();
            markup=null;
            theEl.style.overflow = "none";
          },500);
        },10);
      }
    };
    return actionsheet;
  })();
})(jq);
(function($){


  $.get_with_token = function(options){
    $.ajax({
      type: 'GET',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.api_url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };


  $.post_with_token = function(options){
    $.ajax({
      type: 'POST',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.api_url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };
  
  $.put_with_token = function(options){
    $.ajax({
      type: 'PUT',
      dataType: 'application/json',
      headers: { 'Authorization': current_user.token },
      url: server+options.api_url,
      data: options.data,
      success: options.success,
      error: options.error
    });
  };
/*
  $.get_with_token({
    api_url: options.api_url,
    data: options.data,
    success: function(response, statusText, xhr){},
    error: function(data){}
  });

 * Execute an Ajax call with the given options
 * options.type - Type of request
 * options.beforeSend - function to execute before sending the request
 * options.success - success callback
 * options.error(context, xhr, 'error', e) - error callback
 * options.complete - complete callback - called with a success or error
 * options.timeout - timeout to wait for the request
 * options.url - URL to make request against
 * options.contentType - HTTP Request Content Type
 * options.headers - Object of headers to set
 * options.dataType - Data type of request
 * options.data - data to pass into request.  $.param is called on objects


*/
})(jq);

(function ($) {
  var cache = [];
  var objId=function(object){
    if(!object.jqmCSS3AnimateId) object.jqmCSS3AnimateId=$.uuid();
    return object.jqmCSS3AnimateId;
  };
  var getEl=function(element_id){
    if (typeof element_id == "string" || element_id instanceof String) {
      return document.getElementById(element_id);
    } else if($.is$(element_id)){
      return element_id[0];
    } else {
      return element_id;
    }
  };
  var getCSS3Animate=function(object, options){
    var tmp, id, element = getEl(object);
    //first one
    id = objId(element);
    if(cache[id]){
      cache[id].animate(options);
      tmp = cache[id];
    } else {
      tmp = css3Animate(element, options);
      cache[id] = tmp;
    }
    return tmp;
  };
  $.fn["css3Animate"] = function (options) {
    //keep old callback system - backwards compatibility - should be deprecated in future versions
    if(!options.complete && options.callback) options.complete = options.callback;
    //first on
    var tmp = getCSS3Animate(this[0], options);
    options.complete=null;
    options.sucess=null;
    options.failure=null;
    for (var i = 1; i < this.length; i++) {
      tmp.link(this[i], options);
    }
    return tmp;
  };


  $["css3AnimateQueue"] = function () {
    return new css3Animate.queue();
  };

  //if (!window.WebKitCSSMatrix) return;
  var translateOpen =$.feat.cssTransformStart;
  var translateClose = $.feat.cssTransformEnd;
  var transitionEnd=$.feat.cssPrefix.replace(/-/g,"")+"TransitionEnd";
  transitionEnd=($.os.fennec||$.feat.cssPrefix==""||$.os.ie)?"transitionend":transitionEnd;

  transitionEnd=transitionEnd.replace(transitionEnd.charAt(0),transitionEnd.charAt(0).toLowerCase());

  var css3Animate = (function () {

    var css3Animate = function (element_id, options) {
      if(!(this instanceof css3Animate)) return new css3Animate(element_id, options);

      //start doing stuff
      this.callbacksStack = [];
      this.activeEvent = null;
      this.countStack = 0;
      this.isActive = false;
      this.element = element_id;
      this.linkFinishedProxy_ = $.proxy(this.linkFinished, this);

      if (!this.element) return;

      this.animate(options);

      var that = this;
      jq(this.element).bind('destroy', function(){
        var id = that.element.jqmCSS3AnimateId;
        that.callbacksStack = [];
        if(cache[id]) delete cache[id];
      });
    };
    css3Animate.prototype = {
      animate:function(options){

        //cancel current active animation on this object
        if(this.isActive) this.cancel();
        this.isActive = true;

        if (!options) {
          alert("Please provide configuration options for animation of " + this.element.id);
          return;
        }

        var classMode = !!options["addClass"];

        if(classMode){
          //class defines properties being changed
          if(options["removeClass"]){
            jq(this.element).replaceClass(options["removeClass"], options["addClass"]);
          } else {
            jq(this.element).addClass(options["addClass"]);
          }

        } else {
          //property by property
          var timeNum = numOnly(options["time"]);
          if(timeNum==0) options["time"]=0;

          if (!options["y"]) options["y"] = 0;
          if (!options["x"]) options["x"] = 0;
          if (options["previous"]) {
            var cssMatrix = new $.getCssMatrix(this.element);
            options.y += numOnly(cssMatrix.f);
            options.x += numOnly(cssMatrix.e);
          }
          if (!options["origin"]) options.origin = "0% 0%";

          if (!options["scale"]) options.scale = "1";

          if (!options["rotateY"]) options.rotateY = "0";
          if (!options["rotateX"]) options.rotateX = "0";
          if (!options["skewY"]) options.skewY = "0";
          if (!options["skewX"]) options.skewX = "0";


          if (!options["timingFunction"]) options["timingFunction"] = "linear";

          //check for percent or numbers
          if (typeof (options.x) == "number" || (options.x.indexOf("%") == -1 && options.x.toLowerCase().indexOf("px") == -1 && options.x.toLowerCase().indexOf("deg") == -1)) options.x = parseInt(options.x) + "px";
          if (typeof (options.y) == "number" || (options.y.indexOf("%") == -1 && options.y.toLowerCase().indexOf("px") == -1 && options.y.toLowerCase().indexOf("deg") == -1)) options.y = parseInt(options.y) + "px";

          var trans= "translate" + translateOpen + (options.x) + "," + (options.y) + translateClose + " scale(" + parseFloat(options.scale) + ") rotate(" + options.rotateX + ")";
          if(!$.os.opera)
            trans+=" rotateY(" + options.rotateY + ")";
          trans+=" skew(" + options.skewX + "," + options.skewY + ")";
          this.element.style[$.feat.cssPrefix+"Transform"]=trans;
          this.element.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
          var properties = $.feat.cssPrefix+"Transform";
          if (options["opacity"]!==undefined) {
            this.element.style.opacity = options["opacity"];
            properties+=", opacity";
          }
          if (options["width"]) {
            this.element.style.width = options["width"];
            properties = "all";
          }
          if (options["height"]) {
            this.element.style.height = options["height"];
            properties = "all";
          }
          this.element.style[$.feat.cssPrefix+"TransitionProperty"] = "all";

          if((""+options["time"]).indexOf("s")===-1) {
            var scale = 'ms';
            var time = options["time"]+scale;
          } else if(options["time"].indexOf("ms")!==-1){
            var scale = 'ms';
            var time = options["time"];
          } else {
            var scale = 's';
            var time = options["time"]+scale;
          }

          this.element.style[$.feat.cssPrefix+"TransitionDuration"] = time;
          this.element.style[$.feat.cssPrefix+"TransitionTimingFunction"] = options["timingFunction"];
          this.element.style[$.feat.cssPrefix+"TransformOrigin"] = options.origin;

        }

        //add callback to the stack

        this.callbacksStack.push({
          complete : options["complete"],
          success : options["success"],
          failure : options["failure"]
        });
        this.countStack++;

        var that = this;
        var style = window.getComputedStyle(this.element);
        if(classMode){
          //get the duration
          var duration = style[$.feat.cssPrefix+"TransitionDuration"];
          var timeNum = numOnly(duration);
          if(duration.indexOf("ms")!==-1){
            var scale = 'ms';
          } else {
            var scale = 's';
          }
        }

        //finish asap
        if(timeNum==0 || (scale=='ms' && timeNum<5) || style.display=='none'){
          //the duration is nearly 0 or the element is not displayed, finish immediatly
          $.asap($.proxy(this.finishAnimation, this, [false]));
          //this.finishAnimation();
          //set transitionend event
        } else {
          //setup the event normally

          var that=this;
          this.activeEvent = function(event){
            clearTimeout(that.timeout);
            that.finishAnimation(event);
            that.element.removeEventListener(transitionEnd, that.activeEvent, false);
          };
          that.timeout=setTimeout(this.activeEvent, numOnly(options["time"]) + 50);
          this.element.addEventListener(transitionEnd, this.activeEvent, false);

        }

      },
      addCallbackHook:function(callback){
        if(callback) this.callbacksStack.push(callback);
        this.countStack++;
        return this.linkFinishedProxy_;
      },
      linkFinished:function(canceled){
        if(canceled) this.cancel();
        else this.finishAnimation();
      },
      finishAnimation: function (event) {
        if(event) event.preventDefault();
        if(!this.isActive) return;

        this.countStack--;

        if(this.countStack==0) this.fireCallbacks(false);
      },
      fireCallbacks:function(canceled){
        this.clearEvents();

        //keep callbacks after cleanup
        // (if any of the callbacks overrides this object, callbacks will keep on fire as expected)
        var callbacks = this.callbacksStack;

        //cleanup
        this.cleanup();

        //fire all callbacks
        for(var i=0; i<callbacks.length; i++) {
          var complete = callbacks[i]['complete'];
          var success = callbacks[i]['success'];
          var failure = callbacks[i]['failure'];
          //fire callbacks
          if(complete && typeof (complete) == "function") complete(canceled);
          //success/failure
          if(canceled && failure && typeof (failure) == "function") failure();
          else if(success && typeof (success) == "function") success();
        }
      },
      cancel:function(){
        if(!this.isActive) return;
        this.fireCallbacks(true); //fire failure callbacks
      },
      cleanup:function(){
        this.callbacksStack=[];
        this.isActive = false;
        this.countStack = 0;
      },
      clearEvents:function(){
        if(this.activeEvent) {
          this.element.removeEventListener(transitionEnd, this.activeEvent, false);
        }
        this.activeEvent = null;
      },
      link: function (element_id, options) {
        var callbacks = {complete:options.complete,success:options.success,failure:options.failure};
        options.complete = this.addCallbackHook(callbacks);
        options.success = null;
        options.failure = null;
        //run the animation with the replaced callbacks
        getCSS3Animate(element_id, options);
        //set the old callback back in the object to avoid strange stuff
        options.complete = callbacks.complete;
        options.success = callbacks.success;
        options.failure = callbacks.failure;
        return this;
      }
    }

    return css3Animate;
  })();

  css3Animate.queue = function () {
    return {
      elements: [],
      push: function (element) {
        this.elements.push(element);
      },
      pop: function () {
        return this.elements.pop();
      },
      run: function () {
        var that = this;
        if (this.elements.length == 0) return;
        if (typeof (this.elements[0]) == "function") {
          var func = this.shift();
          func();
        }
        if (this.elements.length == 0) return;
        var params = this.shift();
        if (this.elements.length > 0) params.complete = function (canceled) {
          if(!canceled) that.run();
        };
        css3Animate(document.getElementById(params.id), params);
      },
      shift: function () {
        return this.elements.shift();
      }
    }
  };
})(jq);
(function($){

  //make these into functions for creating a modal div
  //it shouldnt be in the dom if its not needed
  //These originally ran in the initializer of ui_kit

//
//  //Make the loading mask Div in the background
//  var maskDiv = document.createElement("div");
//  maskDiv.id = "jQui_mask";
//  maskDiv.className = "ui-loader";
//  maskDiv.innerHTML = "<span class='ui-icon ui-icon-loading spin'></span><h1>Loading Content</h1>";
//  maskDiv.style.zIndex = 20000;
//  maskDiv.style.display = "none";
//  document.body.appendChild(maskDiv);
//
//
//
//  //Setup the modalDiv in the background
//  var modalDiv = document.createElement("div");
//  modalDiv.id = "modal_ui";
//  this.ui_kit_container.prepend(modalDiv);
//  modalDiv.appendChild($("<div id='modalContainer'></div>").get());
//  this.scrolling_divs['modal_container'] = $("#modalContainer").scroller({
//    scrollBars: true,
//    vertical: true,
//    vScrollCSS: "jqmScrollbar",
//    noParent: true
//  });
//  this.modal_window = modalDiv;



  $.ui.show_modal= function (id) {
    var that = this;
    id = "#" + id.replace("#", "");
    try {
      if ($(id)) {
        jq("#modalContainer").html($.feat.nativeTouchScroll ? $(id).html() : $(id).get(0).childNodes[0].innerHTML + '', true);
        $('#modalContainer').append("<a href='javascript:;' onclick='$.ui.hide_modal();' class='closebutton modalbutton'></a>");
        this.modal_window.style.display = "block";

        this.scrolling_divs['modal_container'].enable(that.reset_scrollers);
        this.scrollToTop('modal');
        $("#modalContainer").data("panel", id);
      }
    } catch (e) {
      0;
    }
  };

  $.ui.hide_modal = function () {
    var modal = $("#modalContainer");
    modal.html("", true);
    $("#modal_ui").hide();

    this.scrolling_divs['modal_container'].disable();

    var tmp = $(modal.data("panel"));
    var fnc = tmp.data("unload");
    if (typeof fnc == "string" && window[fnc]) {
      window[fnc](tmp.get(0));
    }
//      tmp.trigger("unloadpanel");

  };



})(jq);
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
    getOldPasswords: function (element_id) {
      //   if ($.os.android == false) return; -  iOS users seem to want this too, so we'll let everyone join the party
      var container = element_id && document.getElementById(element_id) ? document.getElementById(element_id) : document;
      if (!container) {
        alert("Could not find container element for password_box " + element_id);
        return;
      }
      var sels = container.getElementsByTagName("input");

      var that = this;
      for (var i = 0; i < sels.length; i++) {
        if (sels[i].type != "password") continue;

        if($.os.webkit){
          sels[i].type = "text";
          sels[i].style['-webkit-text-security'] = "disc";
        }
      }
    },

    changePasswordVisiblity: function (what, id) {
      what = parseInt(what);
      var theEl = document.getElementById(id);

      if (what == 1) { //show
        theEl.style[$.cssPrefix+'text-security'] = "none";
      } else {
        theEl.style[$.cssPrefix+'text-security'] = "disc";
      }
      if(!$.os.webkit) {
        if(what==1)
          theEl.type="text"
        else
          theEl.type="password";
      }
      theEl = null;
    }
  };
})(jq);
/**
 * jq.popup - a popup/alert library for html5 mobile apps
 * @copyright Indiepath 2011 - Tim Fisher
 * Modifications/enhancements by appMobi for jqMobi
 *
 */

/* EXAMPLE
 $('body').popup({
 title:"Alert! Alert!",
 message:"This is a test of the emergency alert system!! Don't PANIC!",
 cancelText:"Cancel me",
 cancelCallback: function(){console.log("cancelled");},
 doneText:"I'm done!",
 doneCallback: function(){console.log("Done for!");},
 cancelOnly:false,
 doneClass:'button',
 cancelClass:'button',
 onShow:function(){console.log('showing popup');}
 autoCloseDone:true, //default is true will close the popup when done is clicked.
 suppressTitle:false //Do not show the title if set to true
 });

 You can programatically trigger a close by dispatching a "close" event to it.

 $('body').popup({title:'Alert',id:'myTestPopup'});
 $("#myTestPopup").trigger("close");

 */
(function($) {

  $.fn.popup = function(options) {
    return new popup(this[0], options);
  };
  var queue = [];
  var popup = (function() {
    var popup = function(containerEl, options) {

      if (typeof containerEl === "string" || containerEl instanceof String) {
        this.container = document.getElementById(containerEl);
      } else {
        this.container = containerEl;
      }
      if (!this.container) {
        alert("Error finding container for popup " + containerEl);
        return;
      }

      try {
        if (typeof (options) === "string" || typeof (options) === "number")
          options = {message: options,cancelOnly: "true",cancelText: "OK"};
        this.id = id = options.id = options.id || $.uuid(); //options is passed by reference
        var self = this;
        this.title = options.suppressTitle?"":(options.title || "Alert");
        this.message = options.message || "";
        this.cancelText = options.cancelText || "Cancel";
        this.cancelCallback = options.cancelCallback || function() {
        };
        this.cancelClass = options.cancelClass || "button";
        this.doneText = options.doneText || "Done";
        this.doneCallback = options.doneCallback || function(self) {
          // no action by default
        };
        this.doneClass = options.doneClass || "button";
        this.cancelOnly = options.cancelOnly || false;
        this.onShow = options.onShow || function(){};
        this.autoCloseDone=options.autoCloseDone!==undefined?options.autoCloseDone:true;

        queue.push(this);
        if (queue.length == 1)
          this.show();
      } catch (e) {
        0;
      }

    };

    popup.prototype = {
      id: null,
      title: null,
      message: null,
      cancelText: null,
      cancelCallback: null,
      cancelClass: null,
      doneText: null,
      doneCallback: null,
      doneClass: null,
      cancelOnly: false,
      onShow: null,
      autoCloseDone:true,
      supressTitle:false,
      show: function() {
        var self = this;
        var markup = '<div id="' + this.id + '" class="jqPopup hidden">\
	        				<header>' + this.title + '</header>\
	        				<div><div style="width:1px;height:1px;-webkit-transform:translate3d(0,0,0);float:right"></div>' + this.message + '</div>\
	        				<footer style="clear:both;">\
	        					<a href="javascript:;" class="'+this.cancelClass+'" id="cancel">' + this.cancelText + '</a>\
	        					<a href="javascript:;" class="'+this.doneClass+'" id="action">' + this.doneText + '</a>\
	        				</footer>\
	        			</div></div>';
        $(this.container).append($(markup));

        var $el=$("#"+this.id);
        $el.bind("close", function(){
          self.hide();
        })

        if (this.cancelOnly) {
          $el.find('A#action').hide();
          $el.find('A#cancel').addClass('center');
        }
        $el.find('A').each(function() {
          var button = $(this);
          button.bind('click', function(e) {
            if (button.attr('id') == 'cancel') {
              self.cancelCallback.call(self.cancelCallback, self);
              self.hide();
            } else {
              self.doneCallback.call(self.doneCallback, self);
              if(self.autoCloseDone)
                self.hide();
            }
            e.preventDefault();
          });
        });
        self.positionPopup();
        $.block_ui(0.5);
        $el.removeClass('hidden');
        $el.bind("orientationchange", function() {
          self.positionPopup();
        });

        //force header/footer showing to fix CSS style bugs
        $el.find("header").show();
        $el.find("footer").show();
        this.onShow(this);

      },

      hide: function() {
        var self = this;
        $('#' + self.id).addClass('hidden');
        $.unblock_ui();
        setTimeout(function() {
          self.remove();
        }, 250);
      },

      remove: function() {
        var self = this;
        var $el=$("#"+self.id);
        $el.unbind("close");
        $el.find('BUTTON#action').unbind('click');
        $el.find('BUTTON#cancel').unbind('click');
        $el.unbind("orientationchange").remove();
        queue.splice(0, 1);
        if (queue.length > 0)
          queue[0].show();
      },

      positionPopup: function() {
        var popup = $('#' + this.id);
        popup.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popup[0].clientHeight / 2) + "px");
        popup.css("left", (window.innerWidth / 2) - (popup[0].clientWidth / 2) + "px");
      }
    };

    return popup;
  })();
  var uiBlocked = false;
  $.block_ui = function(opacity) {
    if (uiBlocked)
      return;
    opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
    $('BODY').prepend($("<div id='mask'" + opacity + "></div>"));
    $('BODY DIV#mask').bind("touchstart", function(e) {
      e.preventDefault();
    });
    $('BODY DIV#mask').bind("touchmove", function(e) {
      e.preventDefault();
    });
    uiBlocked = true
  };

  $.unblock_ui = function() {
    uiBlocked = false;
    $('BODY DIV#mask').unbind("touchstart");
    $('BODY DIV#mask').unbind("touchmove");
    $("BODY DIV#mask").remove();
  };
  /**
   * Here we override the window.alert function due to iOS eating touch events on native alerts
   */
  window.alert = function(text) {
    if(text===null||text===undefined)
      text="null";
    if($("#ui_kit").length>0)
      $("#ui_kit").popup(text.toString());
    else
      $(document.body).popup(text.toString());
  }

})(jq);
/**
 * jq.scroller - rewritten by Carlos Ouro @ Badoo
 * Supports iOS native touch scrolling and a much improved javascript scroller
 */
(function($) {
  var HIDE_REFRESH_TIME = 75; // hide animation of pull2ref duration in ms
  var cache = [];
  var objId = function(object) {
    if(!object.jqmScrollerId) object.jqmScrollerId = $.uuid();
    return object.jqmScrollerId;
  }
  $.fn["scroller"] = function(options) {
    var tmp, id;
    for(var i = 0; i < this.length; i++) {
      //cache system
      id = objId(this[i]);
      if(!cache[id]) {
        if(!options) options = {};
        if(!$.feat.nativeTouchScroll) options.useJsScroll = true;

        tmp = scroller(this[i], options);
        cache[id] = tmp;
      } else {
        tmp = cache[id];
      }
    }
    return this.length == 1 ? tmp : this;
  };
  var boundTouchLayer = false;

  function checkConsistency(id) {
    if(!cache[id].element) {
      delete cache[id];
      return false;
    }
    return true;
  }

  function bindTouchLayer() {
    //use a single bind for all scrollers
    if(jq.os.android && !jq.os.chrome&&jq.os.webkit) {
      var androidFixOn = false;
      //connect to touch_layer to detect editMode
      $.bind($.touch_layer, 'pre-enter-edit', function(focusEl) {
        if(!androidFixOn) {
          androidFixOn = true;
          //activate on scroller
          for(var element in cache)
            if(checkConsistency(element) && cache[element].needsFormsFix(focusEl)) cache[element].startFormsMode();
        }
      });
      $.bind($.touch_layer, ['cancel-enter-edit', 'exit-edit'], function(focusEl) {
        if(androidFixOn) {
          androidFixOn = false;
          //dehactivate on scroller
          for(var element in cache)
            if(checkConsistency(element) && cache[element].androidFormsMode) cache[element].stopFormsMode();
        }
      });
    }
    boundTouchLayer = true;
  }
  var scroller = (function() {
    var translateOpen =$.feat.cssTransformStart;
    var translateClose = $.feat.cssTransformEnd;
    var jsScroller, nativeScroller;

    //initialize and js/native mode selector
    var scroller = function(element_id, options) {


      if(!boundTouchLayer && $.touch_layer && $.isObject($.touch_layer)) bindTouchLayer()
      else if(!($.touch_layer && $.isObject($.touch_layer))) $.touch_layer = {};

      if(typeof element_id == "string" || element_id instanceof String) {
        var element = document.getElementById(element_id);
      } else {
        var element = element_id;
      }
      if(!element) {
        alert("Could not find element for scroller " + element_id);
        return;
      }
      if(jq.os.desktop)
        return new scrollerCore(element,options);
      else if(options.useJsScroll) return new jsScroller(element, options);
      return new nativeScroller(element, options);

    };

    //parent abstract class (common functionality)
    var scrollerCore = function(element,options) {
      this.element=element;
      this.jqEl = $(this.element);
      for(var property in options) {
        this[property] = options[property];
      }
    };
    scrollerCore.prototype = {
      //core default properties
      refresh: false,
      refreshContent: "Pull to Refresh",
      refreshHangTimeout: 2000,
      refreshHeight: 60,
      refreshElement: null,
      refreshCancelCB: null,
      refreshRunning: false,
      scrollTop: 0,
      scrollLeft: 0,
      preventHideRefresh: true,
      verticalScroll: true,
      horizontalScroll: false,
      refreshTriggered: false,
      moved: false,
      eventsActive: false,
      rememberEventsActive: false,
      scrollingLocked: false,
      autoEnable: true,
      blockFormsFix: false,
      loggedPcentY: 0,
      loggedPcentX: 0,
      infinite: false,
      infiniteEndCheck: false,
      infiniteTriggered: false,
      scrollSkip: false,
      scrollTopInterval:null,
      scrollLeftInterval:null,
      _scrollTo:function(params,time){
        var time=parseInt(time);
        if(time==0||isNaN(time))
        {
          this.element.scrollTop=Math.abs(params.y);
          this.element.scrollLeft=Math.abs(params.x);
          return;
        }
        var singleTick=10;
        var distPerTick=(this.element.scrollTop-params.y)/Math.ceil(time/singleTick);
        var distLPerTick=(this.element.scrollLeft-params.x)/Math.ceil(time/singleTick);
        var self=this;
        var toRunY=Math.ceil(this.element.scrollTop-params.y)/distPerTick;
        var toRunX=Math.ceil(this.element.scrollLeft-params.x)/distPerTick;
        var xRun=yRun=0;
        self.scrollTopInterval=window.setInterval(function(){
          self.element.scrollTop-=distPerTick;
          yRun++;
          if(yRun>=toRunY){
            self.element.scrollTop=params.y;
            clearInterval(self.scrollTopInterval);
          }
        },singleTick);

        self.scrollLeftInterval=window.setInterval(function(){
          self.element.scrollLeft-=distLPerTick;
          xRun++;
          if(xRun>=toRunX){
            self.element.scrollLeft=params.x;
            clearInterval(self.scrollLeftInterval);
          }
        },singleTick);
      },
      enable:function(){},
      disable:function(){},
      hideScrollbars:function(){},
      addPullToRefresh:function(){},
      /**
       * We do step animations for 'native' - iOS is acceptable and desktop browsers are fine
       * instead of css3
       */
      _scrollToTop:function(time){
        this._scrollTo({x:0,y:0},time);
      },
      _scrollToBottom:function(time){
        this._scrollTo({x:0,y:this.element.scrollHeight-this.element.offsetHeight},time);
      },
      scrollToBottom:function(time){
        return this._scrollToBottom(time);
      },
      scrollToTop:function(time){
        return this._scrollToTop(time);
      },

      //methods
      init: function(element, options) {
        this.element = element;
        this.jqEl = $(this.element);
        this.defaultProperties();
        for(var property in options) {
          this[property] = options[property];
        }
        //assign self destruct
        var that = this;
        var orientationChangeProxy = function() {
          //no need to readjust if disabled...
          if(that.eventsActive) that.adjustScroll();
        }
        this.jqEl.bind('destroy', function() {
          that.disable(true); //with destroy notice
          var id = that.element.jqmScrollerId;
          if(cache[id]) delete cache[id];
          $.unbind($.touch_layer, 'orientationchange-reshape', orientationChangeProxy);
        });
        $.bind($.touch_layer, 'orientationchange-reshape', orientationChangeProxy);
      },
      needsFormsFix: function(focusEl) {
        return this.useJsScroll && this.isEnabled() && this.element.style.display != "none" && $(focusEl).closest(this.jqEl).size() > 0;
      },
      handleEvent: function(e) {
        if(!this.scrollingLocked) {
          switch(e.type) {
            case 'touchstart':
              clearInterval(this.scrollTopInterval);
              this.preventHideRefresh = !this.refreshRunning; // if it's not running why prevent it xD
              this.moved = false;
              this.onTouchStart(e);
              break;
            case 'touchmove':
              this.onTouchMove(e);
              break;
            case 'touchend':
              this.onTouchEnd(e);
              break;
            case 'scroll':
              this.onScroll(e);
              break;
          }
        }
      },
      coreAddPullToRefresh: function(rEl) {
        if(rEl) this.refreshElement = rEl;
        //Add the pull to refresh text.  Not optimal but keeps from others overwriting the content and worrying about italics
        //add the refresh div
        if(this.refreshElement == null) {
          var orginalEl = document.getElementById(this.container.id + "_pulldown");
          if(orginalEl != null) {
            var jqEl = jq(orginalEl);
          } else {
            var jqEl = jq("<div id='" + this.container.id + "_pulldown' class='jqscroll_refresh' style='border-radius:.6em;border: 1px solid #2A2A2A;background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#666666),color-stop(1,#222222));background:#222222;margin:0px;height:60px;position:relative;text-align:center;line-height:60px;color:white;width:100%;'>" + this.refreshContent + "</div>");
          }
        } else {
          var jqEl = jq(this.refreshElement);
        }
        var element = jqEl.get();

        this.refreshContainer = jq("<div style=\"overflow:hidden;width:100%;height:0;margin:0;padding:0;padding-left:5px;padding-right:5px;display:none;\"></div>");
        $(this.element).prepend(this.refreshContainer.append(element, 'top'));
        this.refreshContainer = this.refreshContainer[0];
      },
      fireRefreshRelease: function(triggered, allowHide) {
        if(!this.refresh || !triggered) return;

        var autoCancel = $.trigger(this, 'refresh-release', [triggered]) !== false;
        this.preventHideRefresh = false;
        this.refreshRunning = true;
        if(autoCancel) {
          var that = this;
          if(this.refreshHangTimeout > 0) this.refreshCancelCB = setTimeout(function() {
            that.hideRefresh()
          }, this.refreshHangTimeout);
        }
      },
      setRefreshContent: function(content) {
        jq(this.container).find(".jqscroll_refresh").html(content);
      },
      lock: function() {
        if(this.scrollingLocked) return;
        this.scrollingLocked = true;
        this.rememberEventsActive = this.eventsActive;
        if(!this.eventsActive) {
          this.initEvents();
        }
      },
      unlock: function() {
        if(!this.scrollingLocked) return;
        this.scrollingLocked = false;
        if(!this.rememberEventsActive) {
          this.removeEvents();
        }
      },
      scrollToItem: function(element, where) { //TODO: add functionality for x position
        if(!$.is$(element)) element = $(element);

        if(where == 'bottom') {
          var itemPos = element.offset();
          var newTop = itemPos.top - this.jqEl.offset().bottom + itemPos.height;
          newTop += 4; //add a small space
        } else {
          var itemTop = element.offset().top;
          var newTop = itemTop - document.body.scrollTop;
          var panelTop = this.jqEl.offset().top;
          if(document.body.scrollTop < panelTop) {
            newTop -= panelTop;
          }
          newTop -= 4; //add a small space
        }

        this.scrollBy({
          y: newTop,
          x: 0
        }, 0);
      },
      setPaddings: function(top, bottom) {
        var element = $(this.element);
        var curTop = numOnly(element.css('paddingTop'));
        element.css('paddingTop', top + "px").css('paddingBottom', bottom + "px");
        //don't let padding mess with scroll
        this.scrollBy({
          y: top - curTop,
          x: 0
        });
      },
      //freak of mathematics, but for our cases it works
      divide: function(a, b) {
        return b != 0 ? a / b : 0;
      },
      isEnabled: function() {
        return this.eventsActive;
      },
      addInfinite: function() {
        this.infinite = true;
      },
      clearInfinite: function() {
        this.infiniteTriggered = false;
        this.scrollSkip = true;
      }
    }

    //extend to jsScroller and nativeScroller (constructs)
    jsScroller = function(element, options) {
      this.init(element, options);
      //test
      //this.refresh=true;
      this.container = this.element.parentNode;
      this.container.jqmScrollerId = element.jqmScrollerId;
      this.jqEl = $(this.container);

      if(this.container.style.overflow != 'hidden') this.container.style.overflow = 'hidden';

      this.addPullToRefresh(null, true);
      if(this.autoEnable) this.enable(true);

      //create vertical scroll
      if(this.verticalScroll && this.verticalScroll == true && this.scrollBars == true) {
        var scrollDiv = createScrollBar(5, 20);
        scrollDiv.style.top = "0px";
        if(this.vScrollCSS) scrollDiv.className = this.vScrollCSS;
        scrollDiv.style.opacity = "0";
        this.container.appendChild(scrollDiv);
        this.vscrollBar = scrollDiv;
        scrollDiv = null;
      }
      //create horizontal scroll
      if(this.horizontalScroll && this.horizontalScroll == true && this.scrollBars == true) {
        var scrollDiv = createScrollBar(20, 5);
        scrollDiv.style.bottom = "0px";


        if(this.hScrollCSS) scrollDiv.className = this.hScrollCSS;
        scrollDiv.style.opacity = "0";
        this.container.appendChild(scrollDiv);
        this.hscrollBar = scrollDiv;
        scrollDiv = null;
      }
      if(this.horizontalScroll) this.element.style['float'] = "left";

      this.element.hasScroller = true;

    };
    nativeScroller = function(element, options) {

      this.init(element, options);
      var $el = $(element);
      if(options.noParent !== true) {
        var oldParent = $el.parent();
        var oldHeight=oldParent.height();
        oldHeight+=oldHeight.indexOf("%")==-1?"px":"";
        $el.css('height', oldHeight);
        $el.parent().parent().append($el);
        oldParent.remove();
      }
      this.container = this.element;
      $el.css("-webkit-overflow-scrolling", "touch");
    }
    nativeScroller.prototype = new scrollerCore();
    jsScroller.prototype = new scrollerCore();




    ///Native scroller
    nativeScroller.prototype.defaultProperties = function() {

      this.refreshContainer = null;
      this.dY = this.cY = 0;
      this.cancelPropagation = false;
      this.loggedPcentY = 0;
      this.loggedPcentX = 0;
      var that = this;
      this.adjustScrollOverflowProxy_ = function() {
        that.jqEl.css('overflow', 'auto');
      }
    }
    nativeScroller.prototype.enable = function(firstExecution) {
      if(this.eventsActive) return;
      this.eventsActive = true;
      //unlock overflow
      this.element.style.overflow = 'auto';
      //set current scroll


      if(!firstExecution) this.adjustScroll();
      //set events
      if(this.refresh || this.infinite&&!jq.os.desktop) this.element.addEventListener('touchstart', this, false);
      this.element.addEventListener('scroll', this, false)
    }
    nativeScroller.prototype.disable = function(destroy) {
      if(!this.eventsActive) return;
      //log current scroll
      this.logPos(this.element.scrollLeft, this.element.scrollTop);
      //lock overflow
      if(!destroy) this.element.style.overflow = 'hidden';
      //remove events
      this.element.removeEventListener('touchstart', this, false);
      this.element.removeEventListener('touchmove', this, false);
      this.element.removeEventListener('touchend', this, false);
      this.element.removeEventListener('scroll', this, false);
      this.eventsActive = false;
    }
    nativeScroller.prototype.addPullToRefresh = function(element, leaveRefresh) {
      this.element.removeEventListener('touchstart', this, false);
      this.element.addEventListener('touchstart', this, false);
      if(!leaveRefresh) this.refresh = true;
      if(this.refresh && this.refresh == true) {
        this.coreAddPullToRefresh(element);
        this.refreshContainer.style.position="absolute";
        this.refreshContainer.style.top="-60px";
        this.refreshContainer.style.height="60px";
        this.refreshContainer.style.display="block";
      }
    }
    nativeScroller.prototype.onTouchStart = function(e) {

      if(this.refreshCancelCB) clearTimeout(this.refreshCancelCB);
      //get refresh ready
      if(this.refresh || this.infinite) {

        this.element.addEventListener('touchmove', this, false);
        this.dY = e.touches[0].pageY;
        if(this.refresh && this.dY <0) {
          this.showRefresh();

        }
      }
      $.trigger(this,"scrollstart",[this.element]);
      $.trigger($.touch_layer,"scrollstart",[this.element]);
    }
    nativeScroller.prototype.onTouchMove = function(e) {

      var newcY = e.touches[0].pageY - this.dY;

      if(!this.moved) {
        this.element.addEventListener('touchend', this, false);
        this.moved = true;
      }

      var difY = newcY - this.cY;


      //check for trigger
      if(this.refresh && (this.element.scrollTop) < 0) {
        this.showRefresh();
        //check for cancel
      } else if(this.refreshTriggered && this.refresh && (this.element.scrollTop > this.refreshHeight)) {
        this.refreshTriggered = false;
        if(this.refreshCancelCB) clearTimeout(this.refreshCancelCB);
        this.hideRefresh(false);
        $.trigger(this, 'refresh-cancel');
      }

      this.cY = newcY;
      e.stopPropagation();
    }
    nativeScroller.prototype.showRefresh=function(){
      if(!this.refreshTriggered){
        this.refreshTriggered = true;
        $.trigger(this, 'refresh-trigger');
      }
    }
    nativeScroller.prototype.onTouchEnd = function(e) {

      var triggered = this.element.scrollTop <= -(this.refreshHeight);

      this.fireRefreshRelease(triggered, true);
      if(triggered){
        //lock in place
        this.refreshContainer.style.position="relative";
        this.refreshContainer.style.top="0px";
      }

      this.dY = this.cY = 0;
      this.element.removeEventListener('touchmove', this, false);
      this.element.removeEventListener('touchend', this, false);
      this.infiniteEndCheck = true;
      if(this.infinite && !this.infiniteTriggered && (Math.abs(this.element.scrollTop) >= (this.element.scrollHeight - this.element.clientHeight))) {
        this.infiniteTriggered = true;
        $.trigger(this, "infinite-scroll");
        this.infiniteEndCheck = true;
      }
      this.touchEndFired = true;
      //pollyfil for scroll end since webkit doesn't give any events during the "flick"
      var max=200;
      var self=this;
      var currPos={
        top:this.element.scrollTop,
        left:this.element.scrollLeft
      };
      var counter=0;
      self.nativePolling=setInterval(function(){
        counter++;
        if(counter>=max){
          clearInterval(self.nativePolling);
          return;
        }
        if(self.element.scrollTop!=currPos.top||self.element.scrollLeft!=currPos.left){
          clearInterval(self.nativePolling);
          $.trigger($.touch_layer, 'scrollend', [self.element]); //notify touch_layer of this elements scrollend
          $.trigger(self,"scrollend",[self.element]);
          //self.doScroll(e);
        }

      },20);
    }
    nativeScroller.prototype.hideRefresh = function(animate) {

      if(this.preventHideRefresh) return;

      var that = this;
      var endAnimationCb = function(canceled){
        if(!canceled){	//not sure if this should be the correct logic....
          that.element.style[$.feat.cssPrefix+"Transform"]="none";
          that.element.style[$.feat.cssPrefix+"TransitionProperty"]="none";
          that.element.scrollTop=0;
          that.logPos(that.element.scrollLeft, 0);
        }
        that.refreshContainer.style.top = "-60px";
        that.refreshContainer.style.position="absolute";
        that.dY = that.cY = 0;
        $.trigger(that,"refresh-finish");
      };

      if(animate === false || !that.jqEl.css3Animate) {
        endAnimationCb();
      } else {
        that.jqEl.css3Animate({
          y: (that.element.scrollTop - that.refreshHeight) + "px",
          x: "0%",
          time: HIDE_REFRESH_TIME + "ms",
          complete: endAnimationCb
        });
      }
      this.refreshTriggered = false;
      //this.element.addEventListener('touchend', this, false);
    }
    nativeScroller.prototype.hideScrollbars = function() {}
    nativeScroller.prototype.scrollTo = function(pos,time) {
      this.logPos(pos.x, pos.y);
      pos.x*=-1;
      pos.y*=-1;
      return this._scrollTo(pos,time);
    }
    nativeScroller.prototype.scrollBy = function(pos,time) {
      pos.x+=this.element.scrollLeft;
      pos.y+=this.element.scrollTop;
      this.logPos(this.element.scrollLeft, this.element.scrollTop);
      return this._scrollTo(pos,time);
    }
    nativeScroller.prototype.scrollToBottom = function(time) {
      //this.element.scrollTop = this.element.scrollHeight;
      this._scrollToBottom(time);
      this.logPos(this.element.scrollLeft, this.element.scrollTop);
    }
    nativeScroller.prototype.onScroll = function(e) {
      if(this.infinite && this.touchEndFired) {
        this.touchEndFired = false;
        return;
      }
      if(this.scrollSkip) {
        this.scrollSkip = false;
        return;
      }

      if(this.infinite) {
        if(!this.infiniteTriggered && (Math.abs(this.element.scrollTop) >= (this.element.scrollHeight - this.element.clientHeight))) {
          this.infiniteTriggered = true;
          $.trigger(this, "infinite-scroll");
          this.infiniteEndCheck = true;
        }
      }


      var that = this;
      if(this.infinite && this.infiniteEndCheck && this.infiniteTriggered) {

        this.infiniteEndCheck = false;
        $.trigger(that, "infinite-scroll-end");
      }
    }
    nativeScroller.prototype.logPos = function(x, y) {


      this.loggedPcentX = this.divide(x, (this.element.scrollWidth));
      this.loggedPcentY = this.divide(y, (this.element.scrollHeight ));
      this.scrollLeft = x;
      this.scrollTop = y;

      if(isNaN(this.loggedPcentX))
        this.loggedPcentX=0;
      if(isNaN(this.loggedPcentY))
        this.loggedPcentY=0;

    }
    nativeScroller.prototype.adjustScroll = function() {
      this.adjustScrollOverflowProxy_();

      this.element.scrollLeft = this.loggedPcentX * (this.element.scrollWidth);
      this.element.scrollTop = this.loggedPcentY * (this.element.scrollHeight );
      this.logPos(this.element.scrollLeft, this.element.scrollTop);
    }



    //JS scroller
    jsScroller.prototype.defaultProperties = function() {

      this.boolScrollLock = false;
      this.currentScrollingObject = null;
      this.elementInfo = null;
      this.verticalScroll = true;
      this.horizontalScroll = false;
      this.scrollBars = true;
      this.vscrollBar = null;
      this.hscrollBar = null;
      this.hScrollCSS = "scrollBar";
      this.vScrollCSS = "scrollBar";
      this.firstEventInfo = null;
      this.moved = false;
      this.preventPullToRefresh = true;
      this.doScrollInterval = null;
      this.refreshRate = 25;
      this.isScrolling = false;
      this.androidFormsMode = false;
      this.refreshSafeKeep = false;

      this.lastScrollbar = "";
      this.finishScrollingObject = null;
      this.container = null;
      this.scrollingFinishCB = null;
      this.loggedPcentY = 0;
      this.loggedPcentX = 0;

    }

    function createScrollBar(width, height) {
      var scrollDiv = document.createElement("div");
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.width = width + "px";
      scrollDiv.style.height = height + "px";
      scrollDiv.style[$.feat.cssPrefix+'BorderRadius'] = "2px";
      scrollDiv.style.borderRadius = "2px";
      scrollDiv.style.opacity = 0;
      scrollDiv.className = 'scrollBar';
      scrollDiv.style.background = "black";
      return scrollDiv;
    }
    jsScroller.prototype.enable = function(firstExecution) {
      if(this.eventsActive) return;
      this.eventsActive = true;
      if(!firstExecution) this.adjustScroll();
      else
        this.scrollerMoveCSS({x:0,y:0},0);
      //add listeners
      this.container.addEventListener('touchstart', this, false);
      this.container.addEventListener('touchmove', this, false);
      this.container.addEventListener('touchend', this, false);

    }
    jsScroller.prototype.adjustScroll = function() {
      //set top/left
      var size = this.getViewportSize();
      this.scrollerMoveCSS({
        x: Math.round(this.loggedPcentX * (this.element.clientWidth - size.w)),
        y: Math.round(this.loggedPcentY * (this.element.clientHeight - size.h))
      }, 0);
    }
    jsScroller.prototype.disable = function() {
      if(!this.eventsActive) return;
      //log top/left
      var cssMatrix = this.getCSSMatrix(this.element);
      this.logPos((numOnly(cssMatrix.e) - numOnly(this.container.scrollLeft)), (numOnly(cssMatrix.f) - numOnly(this.container.scrollTop)));
      //remove event listeners
      this.container.removeEventListener('touchstart', this, false);
      this.container.removeEventListener('touchmove', this, false);
      this.container.removeEventListener('touchend', this, false);
      this.eventsActive = false;
    }
    jsScroller.prototype.addPullToRefresh = function(element, leaveRefresh) {
      if(!leaveRefresh) this.refresh = true;
      if(this.refresh && this.refresh == true) {
        this.coreAddPullToRefresh(element);
        this.element.style.overflow = 'visible';
      }
    }
    jsScroller.prototype.hideScrollbars = function() {
      if(this.hscrollBar) {
        this.hscrollBar.style.opacity = 0
        this.hscrollBar.style[$.feat.cssPrefix+'TransitionDuration'] = "0ms";
      }
      if(this.vscrollBar) {
        this.vscrollBar.style.opacity = 0
        this.vscrollBar.style[$.feat.cssPrefix+'TransitionDuration']  = "0ms";
      }
    }

    jsScroller.prototype.getViewportSize = function() {
      var style = window.getComputedStyle(this.container);
      if(isNaN(numOnly(style.paddingTop))) alert((typeof style.paddingTop) + '::' + style.paddingTop + ':');
      return {
        h: (this.container.clientHeight > window.innerHeight ? window.innerHeight : this.container.clientHeight - numOnly(style.paddingTop) - numOnly(style.paddingBottom)),
        w: (this.container.clientWidth > window.innerWidth ? window.innerWidth : this.container.clientWidth - numOnly(style.paddingLeft) - numOnly(style.paddingRight))
      };
    }

    jsScroller.prototype.onTouchStart = function(event) {

      this.moved = false;
      this.currentScrollingObject = null;

      if(!this.container) return;
      if(this.refreshCancelCB) {
        clearTimeout(this.refreshCancelCB);
        this.refreshCancelCB = null;
      }
      if(this.scrollingFinishCB) {
        clearTimeout(this.scrollingFinishCB);
        this.scrollingFinishCB = null;
      }


      //disable if locked
      if(event.touches.length != 1 || this.boolScrollLock) return;

      // Allow interaction to legit calls, like select boxes, etc.
      if(event.touches[0].target && event.touches[0].target.type != undefined) {
        var tagname = event.touches[0].target.tagName.toLowerCase();
        if(tagname == "select" || tagname == "input" || tagname == "button") // stuff we need to allow
        // access to legit calls
          return;

      }

      //default variables
      var scrollInfo = {
        //current position
        top: 0,
        left: 0,
        //current movement
        speedY: 0,
        speedX: 0,
        absSpeedY: 0,
        absSpeedX: 0,
        deltaY: 0,
        deltaX: 0,
        absDeltaY: 0,
        absDeltaX: 0,
        y: 0,
        x: 0,
        duration: 0
      };

      //element info
      this.elementInfo = {};
      var size = this.getViewportSize();
      this.elementInfo.bottomMargin = size.h;
      this.elementInfo.maxTop = (this.element.clientHeight - this.elementInfo.bottomMargin);
      if(this.elementInfo.maxTop < 0) this.elementInfo.maxTop = 0;
      this.elementInfo.divHeight = this.element.clientHeight;
      this.elementInfo.rightMargin = size.w;
      this.elementInfo.maxLeft = (this.element.clientWidth - this.elementInfo.rightMargin);
      if(this.elementInfo.maxLeft < 0) this.elementInfo.maxLeft = 0;
      this.elementInfo.divWidth = this.element.clientWidth;
      this.elementInfo.hasVertScroll = this.verticalScroll || this.elementInfo.maxTop > 0;
      this.elementInfo.hasHorScroll = this.elementInfo.maxLeft > 0;
      this.elementInfo.requiresVScrollBar = this.vscrollBar && this.elementInfo.hasVertScroll;
      this.elementInfo.requiresHScrollBar = this.hscrollBar && this.elementInfo.hasHorScroll;

      //save event
      this.saveEventInfo(event);
      this.saveFirstEventInfo(event);

      //get the current top
      var cssMatrix = this.getCSSMatrix(this.element);
      scrollInfo.top = numOnly(cssMatrix.f) - numOnly(this.container.scrollTop);
      scrollInfo.left = numOnly(cssMatrix.e) - numOnly(this.container.scrollLeft);

      this.container.scrollTop = this.container.scrollLeft = 0;
      this.currentScrollingObject = this.element;

      //get refresh ready
      if(this.refresh && scrollInfo.top == 0) {
        this.refreshContainer.style.display = "block";
        this.refreshHeight = this.refreshContainer.firstChild.clientHeight;
        this.refreshContainer.firstChild.style.top = (-this.refreshHeight) + 'px';
        this.refreshContainer.style.overflow = 'visible';
        this.preventPullToRefresh = false;
      } else if(scrollInfo.top < 0) {
        this.preventPullToRefresh = true;
        if(this.refresh) this.refreshContainer.style.overflow = 'hidden';
      }

      //set target
      scrollInfo.x = scrollInfo.left;
      scrollInfo.y = scrollInfo.top;

      //vertical scroll bar
      if(this.setVScrollBar(scrollInfo, 0, 0)){
        if (this.container.clientWidth > window.innerWidth)
          this.vscrollBar.style.left = (window.innerWidth - numOnly(this.vscrollBar.style.width) * 3) + "px";
        else
          this.vscrollBar.style.right = "0px";
        this.vscrollBar.style[$.feat.cssPrefix+"Transition"] = '';
        // this.vscrollBar.style.opacity = 1;
      }

      //horizontal scroll
      if(this.setHScrollBar(scrollInfo, 0, 0)){
        if (this.container.clientHeight > window.innerHeight)
          this.hscrollBar.style.top = (window.innerHeight - numOnly(this.hscrollBar.style.height)) + "px";
        else
          this.hscrollBar.style.bottom = numOnly(this.hscrollBar.style.height);
        this.hscrollBar.style[$.feat.cssPrefix+"Transition"] = '';
        // this.hscrollBar.style.opacity = 1;
      }

      //save scrollInfo
      this.lastScrollInfo = scrollInfo;
      this.hasMoved=true;

      this.scrollerMoveCSS(this.lastScrollInfo, 0);
      $.trigger(this,"scrollstart");

    }
    jsScroller.prototype.getCSSMatrix = function(element) {
      if(this.androidFormsMode) {
        //absolute mode
        var top = parseInt(element.style.marginTop);
        var left = parseInt(element.style.marginLeft);
        if(isNaN(top)) top = 0;
        if(isNaN(left)) left = 0;
        return {
          f: top,
          e: left
        };
      } else {
        //regular transform

        var object = $.getCssMatrix(element);
        return object;
      }
    }
    jsScroller.prototype.saveEventInfo = function(event) {
      this.lastEventInfo = {
        pageX: event.touches[0].pageX,
        pageY: event.touches[0].pageY,
        time: event.timeStamp
      }
    }
    jsScroller.prototype.saveFirstEventInfo = function(event) {
      this.firstEventInfo = {
        pageX: event.touches[0].pageX,
        pageY: event.touches[0].pageY,
        time: event.timeStamp
      }
    }
    jsScroller.prototype.setVScrollBar = function(scrollInfo, time, timingFunction) {
      if(!this.elementInfo.requiresVScrollBar) return false;
      var newHeight = (parseFloat(this.elementInfo.bottomMargin / this.elementInfo.divHeight) * this.elementInfo.bottomMargin) + "px";
      if(newHeight != this.vscrollBar.style.height) this.vscrollBar.style.height = newHeight;
      var pos = (this.elementInfo.bottomMargin - numOnly(this.vscrollBar.style.height)) - (((this.elementInfo.maxTop + scrollInfo.y) / this.elementInfo.maxTop) * (this.elementInfo.bottomMargin - numOnly(this.vscrollBar.style.height)));
      if(pos > this.elementInfo.bottomMargin) pos = this.elementInfo.bottomMargin;
      if(pos < 0) pos = 0;
      this.scrollbarMoveCSS(this.vscrollBar, {
        x: 0,
        y: pos
      }, time, timingFunction);
      return true;
    }
    jsScroller.prototype.setHScrollBar = function(scrollInfo, time, timingFunction) {
      if(!this.elementInfo.requiresHScrollBar) return false;
      var newWidth = (parseFloat(this.elementInfo.rightMargin / this.elementInfo.divWidth) * this.elementInfo.rightMargin) + "px";
      if(newWidth != this.hscrollBar.style.width) this.hscrollBar.style.width = newWidth;
      var pos = (this.elementInfo.rightMargin - numOnly(this.hscrollBar.style.width)) - (((this.elementInfo.maxLeft + scrollInfo.x) / this.elementInfo.maxLeft) * (this.elementInfo.rightMargin - numOnly(this.hscrollBar.style.width)));

      if(pos > this.elementInfo.rightMargin) pos = this.elementInfo.rightMargin;
      if(pos < 0) pos = 0;

      this.scrollbarMoveCSS(this.hscrollBar, {
        x: pos,
        y: 0
      }, time, timingFunction);
      return true;
    }

    jsScroller.prototype.onTouchMove = function(event) {

      if(this.currentScrollingObject == null) return;
      //event.preventDefault();
      var scrollInfo = this.calculateMovement(event);
      this.calculateTarget(scrollInfo);

      this.lastScrollInfo = scrollInfo;
      if(!this.moved) {
        if(this.elementInfo.requiresVScrollBar) this.vscrollBar.style.opacity = 1;
        if(this.elementInfo.requiresHScrollBar) this.hscrollBar.style.opacity = 1;
      }
      this.moved = true;


      if(this.refresh && scrollInfo.top == 0) {
        this.refreshContainer.style.display = "block";
        this.refreshHeight = this.refreshContainer.firstChild.clientHeight;
        this.refreshContainer.firstChild.style.top = (-this.refreshHeight) + 'px';
        this.refreshContainer.style.overflow = 'visible';
        this.preventPullToRefresh = false;
      } else if(scrollInfo.top < 0) {
        this.preventPullToRefresh = true;
        if(this.refresh) this.refreshContainer.style.overflow = 'hidden';
      }


      this.saveEventInfo(event);
      this.doScroll();

    }

    jsScroller.prototype.doScroll = function() {

      if(!this.isScrolling && this.lastScrollInfo.x != this.lastScrollInfo.left || this.lastScrollInfo.y != this.lastScrollInfo.top) {
        this.isScrolling = true;
        if(this.onScrollStart) this.onScrollStart();
      } else {
        //nothing to do here, cary on
        return;
      }
      //proceed normally
      var cssMatrix = this.getCSSMatrix(this.element);
      this.lastScrollInfo.top = numOnly(cssMatrix.f);
      this.lastScrollInfo.left = numOnly(cssMatrix.e);

      this.recalculateDeltaY(this.lastScrollInfo);
      this.recalculateDeltaX(this.lastScrollInfo);

      //boundaries control
      this.checkYboundary(this.lastScrollInfo);
      if(this.elementInfo.hasHorScroll) this.checkXboundary(this.lastScrollInfo);

      //pull to refresh elastic
      var positiveOverflow = this.lastScrollInfo.y > 0 && this.lastScrollInfo.deltaY > 0;
      var negativeOverflow = this.lastScrollInfo.y < -this.elementInfo.maxTop && this.lastScrollInfo.deltaY < 0;
      if(positiveOverflow || negativeOverflow) {
        var overflow = positiveOverflow ? this.lastScrollInfo.y : -this.lastScrollInfo.y - this.elementInfo.maxTop;
        var pcent = (this.container.clientHeight - overflow) / this.container.clientHeight;
        if(pcent < .5) pcent = .5;
        //cur top, maxTop or 0?
        var baseTop = 0;
        if((positiveOverflow && this.lastScrollInfo.top > 0) || (negativeOverflow && this.lastScrollInfo.top < -this.elementInfo.maxTop)) {
          baseTop = this.lastScrollInfo.top;
        } else if(negativeOverflow) {
          baseTop = -this.elementInfo.maxTop;
        }
        var changeY = this.lastScrollInfo.deltaY * pcent;
        var absChangeY = Math.abs(this.lastScrollInfo.deltaY * pcent);
        if(absChangeY < 1) changeY = positiveOverflow ? 1 : -1;
        this.lastScrollInfo.y = baseTop + changeY;
      }

      //move
      this.scrollerMoveCSS(this.lastScrollInfo, 0);
      this.setVScrollBar(this.lastScrollInfo, 0, 0);
      this.setHScrollBar(this.lastScrollInfo, 0, 0);

      //check refresh triggering
      if(this.refresh && !this.preventPullToRefresh) {
        if(!this.refreshTriggered && this.lastScrollInfo.top > this.refreshHeight) {
          this.refreshTriggered = true;
          $.trigger(this, 'refresh-trigger');
        } else if(this.refreshTriggered && this.lastScrollInfo.top < this.refreshHeight) {
          this.refreshTriggered = false;
          $.trigger(this, 'refresh-cancel');
        }
      }

      if(this.infinite && !this.infiniteTriggered) {
        if((Math.abs(this.lastScrollInfo.top) >= (this.element.clientHeight - this.container.clientHeight))) {
          this.infiniteTriggered = true;
          $.trigger(this, "infinite-scroll");
        }
      }

    }

    jsScroller.prototype.calculateMovement = function(event, last) {
      //default variables
      var scrollInfo = {
        //current position
        top: 0,
        left: 0,
        //current movement
        speedY: 0,
        speedX: 0,
        absSpeedY: 0,
        absSpeedX: 0,
        deltaY: 0,
        deltaX: 0,
        absDeltaY: 0,
        absDeltaX: 0,
        y: 0,
        x: 0,
        duration: 0
      };

      var prevEventInfo = last ? this.firstEventInfo : this.lastEventInfo;
      var pageX = last ? event.pageX : event.touches[0].pageX;
      var pageY = last ? event.pageY : event.touches[0].pageY;
      var time = last ? event.time : event.timeStamp;

      scrollInfo.deltaY = this.elementInfo.hasVertScroll ? pageY - prevEventInfo.pageY : 0;
      scrollInfo.deltaX = this.elementInfo.hasHorScroll ? pageX - prevEventInfo.pageX : 0;
      scrollInfo.time = time;

      scrollInfo.duration = time - prevEventInfo.time;

      return scrollInfo;
    }

    jsScroller.prototype.calculateTarget = function(scrollInfo) {
      scrollInfo.y = this.lastScrollInfo.y + scrollInfo.deltaY;
      scrollInfo.x = this.lastScrollInfo.x + scrollInfo.deltaX;
    }
    jsScroller.prototype.checkYboundary = function(scrollInfo) {
      var minTop = this.container.clientHeight / 2;
      var maxTop = this.elementInfo.maxTop + minTop;
      //y boundaries
      if(scrollInfo.y > minTop) scrollInfo.y = minTop;
      else if(-scrollInfo.y > maxTop) scrollInfo.y = -maxTop;
      else return;
      this.recalculateDeltaY(scrollInfo);
    }
    jsScroller.prototype.checkXboundary = function(scrollInfo) {
      //x boundaries
      if(scrollInfo.x > 0) scrollInfo.x = 0;
      else if(-scrollInfo.x > this.elementInfo.maxLeft) scrollInfo.x = -this.elementInfo.maxLeft;
      else return;

      this.recalculateDeltaY(scrollInfo);
    }
    jsScroller.prototype.recalculateDeltaY = function(scrollInfo) {
      //recalculate delta
      var oldAbsDeltaY = Math.abs(scrollInfo.deltaY);
      scrollInfo.deltaY = scrollInfo.y - scrollInfo.top;
      newAbsDeltaY = Math.abs(scrollInfo.deltaY);
      //recalculate duration at same speed
      scrollInfo.duration = scrollInfo.duration * newAbsDeltaY / oldAbsDeltaY;

    }
    jsScroller.prototype.recalculateDeltaX = function(scrollInfo) {
      //recalculate delta
      var oldAbsDeltaX = Math.abs(scrollInfo.deltaX);
      scrollInfo.deltaX = scrollInfo.x - scrollInfo.left;
      newAbsDeltaX = Math.abs(scrollInfo.deltaX);
      //recalculate duration at same speed
      scrollInfo.duration = scrollInfo.duration * newAbsDeltaX / oldAbsDeltaX;

    }

    jsScroller.prototype.hideRefresh = function(animate) {
      var that=this;
      if(this.preventHideRefresh) return;
      this.scrollerMoveCSS({
        x: 0,
        y: 0,
        complete:function(){
          $.trigger(that,"refresh-finish");
        }
      }, HIDE_REFRESH_TIME);
      this.refreshTriggered = false;
    }

    jsScroller.prototype.setMomentum = function(scrollInfo) {
      var deceleration = 0.0012;

      //calculate movement speed
      scrollInfo.speedY = this.divide(scrollInfo.deltaY, scrollInfo.duration);
      scrollInfo.speedX = this.divide(scrollInfo.deltaX, scrollInfo.duration);

      scrollInfo.absSpeedY = Math.abs(scrollInfo.speedY);
      scrollInfo.absSpeedX = Math.abs(scrollInfo.speedX);

      scrollInfo.absDeltaY = Math.abs(scrollInfo.deltaY);
      scrollInfo.absDeltaX = Math.abs(scrollInfo.deltaX);

      //set momentum
      if(scrollInfo.absDeltaY > 0) {
        scrollInfo.deltaY = (scrollInfo.deltaY < 0 ? -1 : 1) * (scrollInfo.absSpeedY * scrollInfo.absSpeedY) / (2 * deceleration);
        scrollInfo.absDeltaY = Math.abs(scrollInfo.deltaY);
        scrollInfo.duration = scrollInfo.absSpeedY / deceleration;
        scrollInfo.speedY = scrollInfo.deltaY / scrollInfo.duration;
        scrollInfo.absSpeedY = Math.abs(scrollInfo.speedY);
        if(scrollInfo.absSpeedY < deceleration * 100 || scrollInfo.absDeltaY < 5) scrollInfo.deltaY = scrollInfo.absDeltaY = scrollInfo.duration = scrollInfo.speedY = scrollInfo.absSpeedY = 0;
      } else if(scrollInfo.absDeltaX) {
        scrollInfo.deltaX = (scrollInfo.deltaX < 0 ? -1 : 1) * (scrollInfo.absSpeedX * scrollInfo.absSpeedX) / (2 * deceleration);
        scrollInfo.absDeltaX = Math.abs(scrollInfo.deltaX);
        scrollInfo.duration = scrollInfo.absSpeedX / deceleration;
        scrollInfo.speedX = scrollInfo.deltaX / scrollInfo.duration;
        scrollInfo.absSpeedX = Math.abs(scrollInfo.speedX);
        if(scrollInfo.absSpeedX < deceleration * 100 || scrollInfo.absDeltaX < 5) scrollInfo.deltaX = scrollInfo.absDeltaX = scrollInfo.duration = scrollInfo.speedX = scrollInfo.absSpeedX = 0;
      } else scrollInfo.duration = 0;
    }


    jsScroller.prototype.onTouchEnd = function(event) {


      if(this.currentScrollingObject == null || !this.moved) return;
      //event.preventDefault();
      this.finishScrollingObject = this.currentScrollingObject;
      this.currentScrollingObject = null;

      var scrollInfo = this.calculateMovement(this.lastEventInfo, true);
      if(!this.androidFormsMode) {
        this.setMomentum(scrollInfo);
      }
      this.calculateTarget(scrollInfo);

      //get the current top
      var cssMatrix = this.getCSSMatrix(this.element);
      scrollInfo.top = numOnly(cssMatrix.f);
      scrollInfo.left = numOnly(cssMatrix.e);

      //boundaries control
      this.checkYboundary(scrollInfo);
      if(this.elementInfo.hasHorScroll) this.checkXboundary(scrollInfo);

      var triggered = !this.preventPullToRefresh && (scrollInfo.top > this.refreshHeight || scrollInfo.y > this.refreshHeight);
      this.fireRefreshRelease(triggered, scrollInfo.top > 0);

      //refresh hang in
      if(this.refresh && triggered) {
        scrollInfo.y = this.refreshHeight;
        scrollInfo.duration = HIDE_REFRESH_TIME;
        //top boundary
      } else if(scrollInfo.y >= 0) {
        scrollInfo.y = 0;
        if(scrollInfo.top >= 0) scrollInfo.duration = HIDE_REFRESH_TIME;
        //lower boundary
      } else if(-scrollInfo.y > this.elementInfo.maxTop || this.elementInfo.maxTop == 0) {
        scrollInfo.y = -this.elementInfo.maxTop;
        if(-scrollInfo.top > this.elementInfo.maxTop) scrollInfo.duration = HIDE_REFRESH_TIME;
        //all others
      }

      if(this.androidFormsMode) scrollInfo.duration = 0;
      this.scrollerMoveCSS(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");
      this.setVScrollBar(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");
      this.setHScrollBar(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");

      this.setFinishCalback(scrollInfo.duration);
      if(this.infinite && !this.infiniteTriggered) {
        if((Math.abs(scrollInfo.y) >= (this.element.clientHeight - this.container.clientHeight))) {
          this.infiniteTriggered = true;
          $.trigger(this, "infinite-scroll");
        }
      }
    }

    //finish callback
    jsScroller.prototype.setFinishCalback = function(duration) {
      var that = this;
      this.scrollingFinishCB = setTimeout(function() {
        that.hideScrollbars();
        $.trigger($.touch_layer, 'scrollend', [that.element]); //notify touch_layer of this elements scrollend
        $.trigger(that,"scrollend",[that.element]);
        that.isScrolling = false;
        that.elementInfo = null; //reset elementInfo when idle
        if(that.infinite) $.trigger(that, "infinite-scroll-end");
      }, duration);
    }

    //Android Forms Fix
    jsScroller.prototype.startFormsMode = function() {
      if(this.blockFormsFix) return;
      //get prev values
      var cssMatrix = this.getCSSMatrix(this.element);
      //toggle vars
      this.refreshSafeKeep = this.refresh;
      this.refresh = false;
      this.androidFormsMode = true;
      //set new css rules
      this.element.style[$.feat.cssPrefix+"Transform"] = "none";
      this.element.style[$.feat.cssPrefix+"Transition"] = "none";
      this.element.style[$.feat.cssPrefix+"Perspective"] = "none";

      //set position
      this.scrollerMoveCSS({
        x: numOnly(cssMatrix.e),
        y: numOnly(cssMatrix.f)
      }, 0);

      //container
      this.container.style[$.feat.cssPrefix+"Perspective"] = "none";
      this.container.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
      //scrollbars
      if(this.vscrollBar){
        this.vscrollBar.style[$.feat.cssPrefix+"Transform"] = "none";
        this.vscrollBar.style[$.feat.cssPrefix+"Transition"] = "none";
        this.vscrollBar.style[$.feat.cssPrefix+"Perspective"] = "none";
        this.vscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
      }
      if(this.hscrollBar){
        this.hscrollBar.style[$.feat.cssPrefix+"Transform"] = "none";
        this.hscrollBar.style[$.feat.cssPrefix+"Transition"] = "none";
        this.hscrollBar.style[$.feat.cssPrefix+"Perspective"] = "none";
        this.hscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
      }

    }
    jsScroller.prototype.stopFormsMode = function() {
      if(this.blockFormsFix) return;
      //get prev values
      var cssMatrix = this.getCSSMatrix(this.element);
      //toggle vars
      this.refresh = this.refreshSafeKeep;
      this.androidFormsMode = false;
      //set new css rules
      this.element.style[$.feat.cssPrefix+"Perspective"] = 1000;
      this.element.style.marginTop = 0;
      this.element.style.marginLeft = 0;
      this.element.style[$.feat.cssPrefix+"Transition"] = '0ms linear';	//reactivate transitions
      //set position
      this.scrollerMoveCSS({
        x: numOnly(cssMatrix.e),
        y: numOnly(cssMatrix.f)
      }, 0);
      //container
      this.container.style[$.feat.cssPrefix+"Perspective"] = 1000;
      this.container.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
      //scrollbars
      if(this.vscrollBar){
        this.vscrollBar.style[$.feat.cssPrefix+"Perspective"] = 1000;
        this.vscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
      }
      if(this.hscrollBar){
        this.hscrollBar.style[$.feat.cssPrefix+"Perspective"] = 1000;
        this.hscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
      }

    }



    jsScroller.prototype.scrollerMoveCSS = function(distanceToMove, time, timingFunction) {
      if(!time) time = 0;
      if(!timingFunction) timingFunction = "linear";
      time=numOnly(time);
      if(this.element && this.element.style) {

        //do not touch the DOM if disabled
        if(this.eventsActive) {
          if(this.androidFormsMode) {
            this.element.style.marginTop = Math.round(distanceToMove.y) + "px";
            this.element.style.marginLeft = Math.round(distanceToMove.x) + "px";
          } else {

            this.element.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
            this.element.style[$.feat.cssPrefix+"TransitionDuration"]= time + "ms";
            this.element.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
          }
        }
        // Position should be updated even when the scroller is disabled so we log the change
        this.logPos(distanceToMove.x, distanceToMove.y);
      }
    }
    jsScroller.prototype.logPos = function(x, y) {

      if(!this.elementInfo) {
        var size = this.getViewportSize();
      } else {
        var size = {
          h: this.elementInfo.bottomMargin,
          w: this.elementInfo.rightMargin
        }
      }

      this.loggedPcentX = this.divide(x, (this.element.clientWidth - size.w));
      this.loggedPcentY = this.divide(y, (this.element.clientHeight - size.h));
      this.scrollTop = y;
      this.scrollLeft = x;
    }
    jsScroller.prototype.scrollbarMoveCSS = function(element, distanceToMove, time, timingFunction) {
      if(!time) time = 0;
      if(!timingFunction) timingFunction = "linear";

      if(element && element.style) {
        if(this.androidFormsMode) {
          element.style.marginTop = Math.round(distanceToMove.y) + "px";
          element.style.marginLeft = Math.round(distanceToMove.x) + "px";
        } else {
          element.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
          element.style[$.feat.cssPrefix+"TransitionDuration"]= time + "ms";
          element.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
        }
      }
    }
    jsScroller.prototype.scrollTo = function(pos, time) {
      if(!time) time = 0;
      this.scrollerMoveCSS(pos, time);
    }
    jsScroller.prototype.scrollBy = function(pos, time) {
      var cssMatrix = this.getCSSMatrix(this.element);
      var startTop = numOnly(cssMatrix.f);
      var startLeft = numOnly(cssMatrix.e);
      this.scrollTo({
        y: startTop - pos.y,
        x: startLeft - pos.x
      }, time);
    }
    jsScroller.prototype.scrollToBottom = function(time) {
      this.scrollTo({
        y: -1 * (this.element.clientHeight - this.container.clientHeight),
        x: 0
      }, time);
    }
    jsScroller.prototype.scrollToTop=function(time){
      this.scrollTo({x:0,y:0},time);
    }
    return scroller;
  })();
})(jq);
/*
 * @copyright: 2011 Intel
 * @description:  This script will replace all drop downs with friendly select controls.  Users can still interact
 * with the old drop down box as normal with javascript, and this will be reflected

 */
(function($) {
  $['select_box'] = {
    scroller: null,
    getOldSelects: function(element_id) {
      if (!$.os.android || $.os.androidICS)
        return;
      if (!$.fn['scroller']) {
        alert("This library requires jq.web.Scroller");
        return;
      }
      var container = element_id && document.getElementById(element_id) ? document.getElementById(element_id) : document;
      if (!container) {
        alert("Could not find container element for jq.web.select_box " + element_id);
        return;
      }
      var sels = container.getElementsByTagName("select");
      var that = this;
      for (var i = 0; i < sels.length; i++) {
        if (sels[i].hasSelectBoxFix)
          continue;
        (function(theSel) {
          var fakeInput = document.createElement("div");
          var theSelStyle = window.getComputedStyle(theSel);
          var width = theSelStyle.width=='intrinsic' ? '100%' : theSelStyle.width;
          var selWidth = parseInt(width) > 0 ? width : '100px';
          var selHeight = parseInt(theSel.style.height) > 0 ? theSel.style.height : (parseInt(theSelStyle.height) ? theSelStyle.height : '20px');
          fakeInput.style.width = selWidth;
          fakeInput.style.height = selHeight;
          fakeInput.style.margin = theSelStyle.margin;
          fakeInput.style.position = theSelStyle.position;
          fakeInput.style.left = theSelStyle.left;
          fakeInput.style.top = theSelStyle.top;
          fakeInput.style.lineHeight = theSelStyle.lineHeight;
          //fakeInput.style.position = "absolute";
          //fakeInput.style.left = "0px";
          //fakeInput.style.top = "0px";
          fakeInput.style.zIndex = "1";
          if (theSel.value)
            fakeInput.innerHTML = theSel.options[theSel.selectedIndex].text;
          fakeInput.style.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAeCAIAAABFWWJ4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NjQxRUQxNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NjQxRUQyNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU2NDFFQ0Y1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU2NDFFRDA1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YWbdCAAAAlklEQVR42mIsKChgIBGwAHFPTw/xGkpKSlggrG/fvhGjgYuLC0gyMZAOoPb8//9/0Or59+8f8XrICQN66SEnDOgcp3AgKiqKqej169dY9Hz69AnCuHv3rrKyMrIKoAhcVlBQELt/gIqwstHD4B8quH37NlAQSKKJEwg3iLbBED8kpeshoGcwh5uuri5peoBFMEluAwgwAK+5aXfuRb4gAAAAAElFTkSuQmCC') right top no-repeat";
          fakeInput.style.backgroundColor = "white";
          fakeInput.style.lineHeight = selHeight;
          fakeInput.style.backgroundSize = "contain";
          fakeInput.className = "jqmobiSelect_fakeInput " + theSel.className;
          fakeInput.id = theSel.id + "_jqmobiSelect";

          fakeInput.style.border = "1px solid gray";
          fakeInput.style.color = "black";
          fakeInput.linkId = theSel.id;
          fakeInput.onclick = function(e) {
            that.initDropDown(this.linkId);
          };
          $(fakeInput).insertBefore($(theSel));
          //theSel.parentNode.style.position = "relative";
          theSel.style.display = "none";
          theSel.style.webkitAppearance = "none";
          // Create listeners to watch when the select value has changed.
          // This is needed so the users can continue to interact as normal,
          // via jquery or other frameworks
          for (var j = 0; j < theSel.options.length; j++) {
            if (theSel.options[j].selected) {
              fakeInput.value = theSel.options[j].text;
            }
            theSel.options[j].watch( "selected", function(prop, oldValue, newValue) {
              if (newValue == true) {
                if(!theSel.getAttribute("multiple"))
                  that.updateMaskValue(this.parentNode.id, this.text, this.value);
                this.parentNode.value = this.value;
              }
              return newValue;
            });
          }
          theSel.watch("selectedIndex", function(prop, oldValue, newValue) {
            if (this.options[newValue]) {
              if(!theSel.getAttribute("multiple"))
                that.updateMaskValue(this.id, this.options[newValue].text, this.options[newValue].value);
              this.value = this.options[newValue].value;
            }
            return newValue;
          });

          fakeInput = null;
          imageMask = null;
          sels[i].hasSelectBoxFix = true;


        })(sels[i]);
      }
      that.createHtml();
    },
    updateDropdown: function(id) {
      var element = document.getElementById(id);
      if (!element)
        return;
      for (var j = 0; j < element.options.length; j++) {
        if (element.options[j].selected)
          fakeInput.value = element.options[j].text;
        element.options[j].watch("selected", function(prop, oldValue, newValue) {
          if (newValue == true) {
            that.updateMaskValue(this.parentNode.id, this.text, this.value);
            this.parentNode.value = this.value;
          }
          return newValue;
        });
      }
      element = null;
    },
    initDropDown: function(element_id) {

      var that = this;
      var element = document.getElementById(element_id);
      if (element.disabled)
        return;
      if (!element || !element.options || element.options.length == 0)
        return;
      var htmlTemplate = "";
      var foundInd = 0;
      document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";

      document.getElementById("jqmobiSelectBoxHeaderTitle").innerHTML = (element.name != undefined && element.name != "undefined" && element.name != "" ? element.name : element_id);

      for (var j = 0; j < element.options.length; j++) {
        var currInd = j;
        element.options[j].watch( "selected", function(prop, oldValue, newValue) {
          if (newValue == true) {
            that.updateMaskValue(this.parentNode.id, this.text, this.value);
            this.parentNode.value = this.value;
          }
          return newValue;
        });
        var checked = (element.options[j].selected) ? true : false;
        var button = "";
        var div = document.createElement("div");
        div.className = "jqmobiSelectRow";
        // div.id = foundID;
        div.style.cssText = ";line-height:40px;font-size:14px;padding-left:10px;height:40px;width:100%;position:relative;width:100%;border-bottom:1px solid black;background:white;";
        var anchor = document.createElement("a");
        anchor.href = "javascript:;";
        div.tmpValue = j;
        div.onclick = function(e) {
          that.setDropDownValue(element_id, this.tmpValue,this);
        };
        anchor.style.cssText = "text-decoration:none;color:black;";
        anchor.innerHTML = element.options[j].text;
        var span = document.createElement("span");
        span.style.cssText = "float:right;margin-right:20px;margin-top:-2px";
        var rad = document.createElement("button");
        if (checked) {
          rad.style.cssText = "background: #000;padding: 0px 0px;border-radius:15px;border:3px solid black;";
          rad.className = "jqmobiSelectRowButtonFound";
        } else {
          rad.style.cssText = "background: #ffffff;padding: 0px 0px;border-radius:15px;border:3px solid black;";
          rad.className = "jqmobiSelectRowButton";
        }
        rad.style.width = "20px";
        rad.style.height = "20px";

        rad.checked = checked;

        anchor.className = "jqmobiSelectRowText";
        span.appendChild(rad);
        div.appendChild(anchor);
        div.appendChild(span);

        document.getElementById("jqmobiSelectBoxScroll").appendChild(div);

        span = null;
        rad = null;
        anchor = null;
      }
      try {
        document.getElementById("jqmobiSelectModal").style.display = 'block';
      } catch (e) {
        0;
      }
      try {
        if (div) {
          var scrollThreshold = numOnly(div.style.height);
          var offset = numOnly(document.getElementById("jqmobiSelectBoxHeader").style.height);

          if (foundInd * scrollThreshold + offset >= numOnly(document.getElementById("jqmobiSelectBoxFix").clientHeight) - offset)
            var scrollToPos = (foundInd) * -scrollThreshold + offset;
          else
            scrollToPos = 0;
          this.scroller.scrollTo({
            x: 0,
            y: scrollToPos
          });
        }
      } catch (e) {
        0;
      }
      div = null;
      element = null;
    },
    updateMaskValue: function(element_id, value, val2) {

      var element = document.getElementById(element_id + "_jqmobiSelect");
      var el2 = document.getElementById(element_id);
      if (element)
        element.innerHTML = value;
      if (typeof (el2.onchange) == "function")
        el2.onchange(val2);
      element = null;
      el2 = null;
    },
    setDropDownValue: function(element_id, value,div) {


      var element = document.getElementById(element_id);
      if(!element)
        return

      if(!element.getAttribute("multiple")){
        element.selectedIndex = value;
        $(element).find("option").forEach(function(object){
          object.selected=false;
        });
        $(element).find("option:nth-child("+(value+1)+")").get(0).selected=true;
        this.scroller.scrollTo({
          x: 0,
          y: 0
        });
        this.hideDropDown();
      }
      else {
        //multi select

        var myEl=$(element).find("option:nth-child("+(value+1)+")").get(0);
        if(myEl.selected){
          myEl.selected=false;
          $(div).find("button").css("background","#fff");
        }
        else {
          myEl.selected=true;
          $(div).find("button").css("background","#000");
        }

      }
      $(element).trigger("change");
      element = null;
    },
    hideDropDown: function() {
      document.getElementById("jqmobiSelectModal").style.display = 'none';
      document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
    },
    createHtml: function() {
      var that = this;
      if (document.getElementById("jqmobiSelectBoxContainer")) {
        return;
      }
      var modalDiv = document.createElement("div");

      modalDiv.style.cssText = "position:absolute;top:0px;bottom:0px;left:0px;right:0px;background:rgba(0,0,0,.7);z-index:200000;display:none;";
      modalDiv.id = "jqmobiSelectModal";

      var myDiv = document.createElement("div");
      myDiv.id = "jqmobiSelectBoxContainer";
      myDiv.style.cssText = "position:absolute;top:8%;bottom:10%;display:block;width:90%;margin:auto;margin-left:5%;height:90%px;background:white;color:black;border:1px solid black;border-radius:6px;";
      myDiv.innerHTML = "<div id='jqmobiSelectBoxHeader' style=\"display:block;font-family:'Eurostile-Bold', Eurostile, Helvetica, Arial, sans-serif;color:#fff;font-weight:bold;font-size:18px;line-height:34px;height:34px; text-transform:uppercase;text-align:left;text-shadow:rgba(0,0,0,.9) 0px -1px 1px;    padding: 0px 8px 0px 8px;    border-top-left-radius:5px; border-top-right-radius:5px; -webkit-border-top-left-radius:5px; -webkit-border-top-right-radius:5px;    background:#39424b;    margin:1px;\"><div style='float:left;' id='jqmobiSelectBoxHeaderTitle'></div><div style='float:right;width:60px;margin-top:-5px'><div id='jqmobiSelectClose' class='button' style='width:60px;height:32px;line-height:32px;'>Close</div></div></div>";
      myDiv.innerHTML += '<div id="jqmobiSelectBoxFix"  style="position:relative;height:90%;background:white;overflow:hidden;width:100%;"><div id="jqmobiSelectBoxScroll"></div></div>';
      var that = this;
      modalDiv.appendChild(myDiv);

      $(document).ready(function() {

        if(jq("#ui_kit"))
          jq("#ui_kit").append(modalDiv);
        else
          document.body.appendChild(modalDiv);
        var close = $("#jqmobiSelectClose").get();
        close.onclick = function() {
          that.hideDropDown();
        };

        var styleSheet = $("<style>.jqselectscrollBarV{opacity:1 !important;}</style>").get();
        document.body.appendChild(styleSheet);
        try {
          that.scroller = $("#jqmobiSelectBoxScroll").scroller({
            scroller: false,
            verticalScroll: true,
            vScrollCSS: "jqselectscrollBarV"
          });

        } catch (e) {
          0;
        }
        modalDiv = null;
        myDiv = null;
        styleSheet = null;
      });
    }
  };

//The following is based off Eli Grey's shim
//https://gist.github.com/384583
//We use HTMLElement to not cause problems with other objects
  if (!HTMLElement.prototype.watch) {
    HTMLElement.prototype.watch = function (prop, handler) {
      var oldval = this[prop], newval = oldval,
          getter = function () {
            return newval;
          },
          setter = function (val) {
            oldval = newval;
            return newval = handler.call(this, prop, oldval, val);
          };
      if (delete this[prop]) { // can't watch constants
        if (HTMLElement.defineProperty) { // ECMAScript 5
          HTMLElement.defineProperty(this, prop, {
            get: getter,
            set: setter,
            enumerable: false,
            configurable: true
          });
        } else if (HTMLElement.prototype.__defineGetter__ && HTMLElement.prototype.__defineSetter__) { // legacy
          HTMLElement.prototype.__defineGetter__.call(this, prop, getter);
          HTMLElement.prototype.__defineSetter__.call(this, prop, setter);
        }
      }
    };
  }
  if (!HTMLElement.prototype.unwatch) {
    HTMLElement.prototype.unwatch = function (prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    };
  }
})(jq);
(function($){



 /*
  $.ui.show_page({
  div_id: 'user_index_view',                               done
  title: 'FunLife',                                    done
  template: 'views/users/user_index_view.js',          done

  header: id_of_header or null                         done
  left_button: id_of_left_button_div or null           done
  right_button: id_of_right_button_div or null         done

  footer: tab_id or null                               done
  active_footer_button: '#bottom_nav_home',            done

  api_url: '/users/',                                  done
  data: 'data_to_be_sent_to_server'                    done
  on_load: function(){}                                done
  on_unload: function(){}                              done
  preload_urls: [url1, url2]                           NOTDONE
  })
  */

  $.ui.show_page = function show_page(options){

    //execute the previous panel's unload
    if(this.on_unload){
      this.on_unload();
      this.on_unload = null;
    }

    //set the unload function to this panel's on_unload
    if(options.on_unload){
      this.unload = options.on_unload;
    }

    //execute the onload function
    if(options.on_load){
      options.on_load();
    }
0;

    this.set_header(options.header);
    this.set_footer(options.footer);
    this.set_active_footer_button(options.active_footer_button);
    this.set_left_button(options.left_button);
    this.set_right_button(options.right_button);

    //if we need to access remote data
    if(options.api_url){
      //check if we have any cached data, and show that first
      if (this.cached_pages[options.div_id] ) {
         0;
        $.ui.add_content_div(options.div_id, tmpl[options.div_id](parsed_data), options.title, this.cached_pages[options.div_id]);
         this.load_content(options.div_id, false, false, 'fade');
         $.get_with_token({
            api_url: options.api_url,
            data: options.data,
            success: function(response, statusText, xhr){
               var parsed_data = JSON.parse(response);
               var data = JSON.parse(response);
               $.ui.update_content_div(options.div_id,  tmpl[options.div_id](parsed_data));
            },
            error: function(){
               0;
            }
        });
      }
      else {
        0;
        $.get_with_token({
          api_url: options.api_url,
          data: options.data,
          success: function(response, statusText, xhr){
            var parsed_data = JSON.parse(response);
            0;
            $.ui.add_content_div(options.div_id, tmpl[options.div_id](parsed_data), options.title);
            $.ui.load_content(options.div_id, false, false, 'fade');
          },
          error: function(a,b){
            0;
            0;
            0;
          }
        });
      }
    }
    //no remote data needed
    else {
      0;
      if ($('#' + options.div_id).length === 0) {
        $.ui.add_content_div(options.div_id, tmpl[options.div_id](options.data), options.title);
      }
      else {
        this.update_content_div(options.div_id,  tmpl[options.div_id](options.data));
      }
      this.load_content(options.div_id, false, false, 'fade');
    }
  };

})(jq);

(function($){

  $.ui.side_menu = {

      //If there is no menu, make one
    create_side_menu: function(){
      if (!this.menu) {
      this.menu = document.createElement("div");
      this.menu.id = "menu";
      this.menu.innerHTML = '<div id="menu_scroller"></div>';
      this.ui_kit_container.append(this.menu);
      this.menu.style.overflow = "hidden";
      this.scrolling_divs["menu_scroller"] = jq("#menu_scroller").scroller({
        scrollBars: true,
        verticalScroll: true,
        vScrollCSS: "jqmScrollbar",
        useJsScroll: !$.feat.nativeTouchScroll,
        noParent: $.feat.nativeTouchScroll
      });
      if ($.feat.nativeTouchScroll)
        $("#menu_scroller").css("height", "100%");
    }
  },

  toggle_side_menu: function (force, callback) {
    this.side_menu_displayed = true;
    var that = this;
    var menu = jq("#menu");
    var elements = jq("#content, #menu, #header, #footer");

    if (!(menu.hasClass("on") || menu.hasClass("to-on")) &&
        ((force !== undefined && force !== false) || force === undefined)) {
      menu.show();
      that.css3animate(elements, {
        "removeClass": "to-off off on",
        "addClass": "to-on",
        complete: function (canceled) {
          if (!canceled) {
            that.css3animate(elements, {
              "removeClass": "to-off off to-on",
              "addClass": "on",
              time: 0,
              complete: function () {
                that.side_menu_displayed = false;
                if (callback)
                  callback(false);
              }
            });
          }
          else {
            that.side_menu_displayed = false;
            if (callback)
              callback(true);
          }
        }
      });

    }
    else if (force === undefined || (force !== undefined && force === false)) {

      that.css3animate(elements, {
        "removeClass": "on off to-on",
        "addClass": "to-off",
        complete: function (canceled) {
          if (!canceled) {
            that.css3animate(elements, {
              "removeClass": "to-off on to-on",
              "addClass": "off",
              time: 0,
              complete: function () {
                menu.hide();
                that.side_menu_displayed = false;
                if (callback){
                  callback(false);
                }
              }
            });
          }
          else {
            that.side_menu_displayed = false;
            if (callback) {
              callback(true);
            }
          }
        }
      });
    }
  },


  disableSideMenu: function () {
    var elements = jq("#content, #menu, #header, #footer");
    if (this.isSideMenuOn()) {
      this.toggle_side_menu(false, function (canceled) {
        if (!canceled)
          elements.removeClass("hasMenu");
      });
    }
    else {
      elements.removeClass("hasMenu");
    }
  },

  enableSideMenu: function () {
    var elements = jq("#content, #menu, #header, #footer");
    elements.addClass("hasMenu");
  },

  isSideMenuEnabled: function () {
    return jq("#content").hasClass("hasMenu");
  },

  isSideMenuOn: function () {
    var menu = jq('#menu');
    return this.isSideMenuEnabled() && (menu.hasClass("on") || menu.hasClass("to-on"));
  },

    update_side_menu: function (elements) {
      var that = this;

      var side_menu_nav = jq("#menu_scroller");

      if (elements === undefined || elements == null)
        return;
      if (typeof (elements) == "string") {
        side_menu_nav.html(elements, true)
      }
      else {
        side_menu_nav.html('');
        var close = document.createElement("a");
        close.className = "closebutton jqMenuClose";
        close.href = "javascript:;"
        close.onclick = function () {
          that.toggle_side_menu(false);
        };
        side_menu_nav.append(close);
        var tmp = document.createElement("div");
        tmp.className = "jqMenuHeader";
        tmp.innerHTML = "Menu";
        side_menu_nav.append(tmp);
        for (var i = 0; i < elements.length; i++) {
          var node = elements[i].cloneNode(true);
          side_menu_nav.append(node);
        }
      }
      //Move the scroller to the top and hide it
      this.scrolling_divs['menu_scroller'].hideScrollbars();
      this.scrolling_divs['menu_scroller'].scrollToTop();
    }

  }
})(jq);
//TouchLayer contributed by Carlos Ouro @ Badoo
//un-authoritive layer between touches and actions on the DOM
//(un-authoritive: listeners do not require useCapture)
//handles overlooking JS and native scrolling, panning,
//no delay on click, edit mode focus, preventing defaults, resizing content,
//enter/exit edit mode (keyboard on screen), prevent clicks on momentum, etc
//It can be used independently in other apps but it is required by jqUi
//Object Events
//Enter Edit Mode:
//pre-enter-edit - when a possible enter-edit is actioned - happens before actual click or focus (android can still reposition elements and event is actioned)
//cancel-enter-edit - when a pre-enter-edit does not result in a enter-edit
//enter-edit - on a enter edit mode focus
//enter-edit-reshape - focus resized/scrolled event
//in-edit-reshape - resized/scrolled event when a different element is focused
//Exit Edit Mode
//exit-edit - on blur
//exit-edit-reshape - blur resized/scrolled event
//Other
//orientationchange-reshape - resize event due to an orientationchange action
//reshape - window.resize/window.scroll event (ignores onfocus "shaking") - general reshape notice
(function() {

  //singleton
  $.touch_layer = function(element) {
    //	if(jq.os.desktop||!jq.os.webkit) return;
    $.touch_layer = new touch_layer(element);
    return $.touch_layer;
  };
  //configuration stuff
  var inputElements = ['input', 'select', 'textarea'];
  var autoBlurInputTypes = ['button', 'radio', 'checkbox', 'range','date'];
  var requiresJSFocus = $.os.ios; //devices which require .focus() on dynamic click events
  var verySensitiveTouch = $.os.blackberry; //devices which have a very sensitive touch and touchmove is easily fired even on simple taps
  var inputElementRequiresNativeTap = $.os.blackberry || ($.os.android && !$.os.chrome); //devices which require the touchstart event to bleed through in order to actually fire the click on select elements
  var selectElementRequiresNativeTap = $.os.blackberry || ($.os.android && !$.os.chrome); //devices which require the touchstart event to bleed through in order to actually fire the click on select elements
  var focusScrolls = $.os.ios; //devices scrolling on focus instead of resizing
  var focusResizes = $.os.blackberry10;
  var requirePanning = $.os.ios; //devices which require panning feature
  var addressBarError = 0.97; //max 3% error in position
  var maxHideTries = 2; //HideAdressBar does not retry more than 2 times (3 overall)
  var skipTouchEnd=false; //Fix iOS bug with alerts/confirms
  function getTime(){
    var d = new Date();
    var n = d.getTime();
    return n;
  }
  var touch_layer = function(element) {
    this.clearTouchVars();
    element.addEventListener('touchstart', this, false);
    element.addEventListener('touchmove', this, false);
    element.addEventListener('touchend', this, false);
    element.addEventListener('click', this, false);
    element.addEventListener("focusin",this,false);
    document.addEventListener('scroll', this, false);
    window.addEventListener("resize", this, false);
    window.addEventListener("orientationchange", this, false);
    this.layer = element;
    //proxies
    this.scrollEndedProxy_ = $.proxy(this.scrollEnded, this);
    this.exitEditProxy_ = $.proxy(this.exitExit, this, []);
    this.launchFixUIProxy_ = $.proxy(this.launchFixUI, this);
    var that = this;
    this.scrollTimeoutExpireProxy_ = function() {
      that.scrollTimeout_ = null;
      that.scrollTimeoutEl_.addEventListener('scroll', that.scrollEndedProxy_, false);
    };
    this.retestAndFixUIProxy_ = function() {
      if(jq.os.android) that.layer.style.height = '100%';
      $.asap(that.testAndFixUI, that, arguments);
    };
    //iPhone double clicks workaround
    document.addEventListener('click', function(e) {
      if(e.clientX !== undefined && that.lastTouchStartX !== null)
      {
        if (2 > Math.abs(that.lastTouchStartX-e.clientX) && 2 > Math.abs(that.lastTouchStartY-e.clientY)){
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }, true);
    //js scrollers self binding
    $.bind(this, 'scrollstart', function(element) {
      that.isScrolling=true;
      that.scrollingEl_=element;
      that.fireEvent('UIEvents', 'scrollstart', element, false, false);
    });
    $.bind(this, 'scrollend', function(element) {
      that.isScrolling=false;

      that.fireEvent('UIEvents', 'scrollend', element, false, false);
    });
    //fix layer positioning
    this.launchFixUI(5); //try a lot to set page into place
  };

  touch_layer.prototype = {
    dX: 0,
    dY: 0,
    cX: 0,
    cY: 0,
    touchStartX:null,
    touchStartY:null,
    //elements
    layer: null,
    scrollingEl_: null,
    scrollTimeoutEl_: null,
    //handles / proxies
    scrollTimeout_: null,
    reshapeTimeout_: null,
    scrollEndedProxy_: null,
    exitEditProxy_: null,
    launchFixUIProxy_: null,
    reHideAddressBarTimeout_: null,
    retestAndFixUIProxy_: null,
    //options
    panElementId: "header",
    //public locks
    blockClicks: false,
    //private locks
    allowDocumentScroll_: false,
    ignoreNextResize_: false,
    blockPossibleClick_: false,
    //status vars
    isScrolling: false,
    isScrollingVertical_: false,
    wasPanning_: false,
    isPanning_: false,
    isFocused_: false,
    justBlurred_: false,
    requiresNativeTap: false,
    holdingReshapeType_: null,

    handleEvent: function(e) {
      switch(e.type) {
        case 'touchstart':
          this.onTouchStart(e);
          break;
        case 'touchmove':
          this.onTouchMove(e);
          break;
        case 'touchend':
          this.onTouchEnd(e);
          break;
        case 'click':
          this.onClick(e);
          break;
        case 'blur':
          this.onBlur(e);
          break;
        case 'scroll':
          this.onScroll(e);
          break;
        case 'orientationchange':
          this.onOrientationChange(e);
          break;
        case 'resize':
          this.onResize(e);
          break;
        case 'focusin':
          this.onFocusIn(e);
          break;
      }
    },
    launchFixUI: function(maxTries) {
      //this.log("launchFixUI");
      if(!maxTries) {
        maxTries = maxHideTries;
      }
      if(this.reHideAddressBarTimeout_ === null){
        return this.testAndFixUI(0, maxTries);
      }
    },
    resetFixUI: function() {
      //this.log("resetFixUI");
      if(this.reHideAddressBarTimeout_) clearTimeout(this.reHideAddressBarTimeout_);
      this.reHideAddressBarTimeout_ = null;
    },
    testAndFixUI: function(retry, maxTries) {
      //this.log("testAndFixUI");
      //for ios or if the heights are incompatible (and not close)
      var refH = this.getReferenceHeight();
      var curH = this.getCurrentHeight();
      if((refH != curH && !(curH * addressBarError < refH && refH * addressBarError < curH))) {
        //panic! page is out of place!
        this.hideAddressBar(retry, maxTries);
        return true;
      }
      if(jq.os.android) this.resetFixUI();
      return false;
    },
    hideAddressBar: function(retry, maxTries) {
      if(retry >= maxTries) {
        this.resetFixUI();
        return; //avoid a possible loop
      }

      //this.log("hiding address bar");
      if(jq.os.desktop || jq.os.chrome) {
        this.layer.style.height = "100%";
      } else if(jq.os.android) {
        //on some phones its immediate
        window.scrollTo(1, 1);
        this.layer.style.height = this.isFocused_ ? (window.innerHeight) + "px" : (window.outerHeight / window.devicePixelRatio) + 'px';
        //sometimes android devices are stubborn
        var that = this;
        //re-test in a bit (some androids (SII, Nexus S, etc) fail to resize on first try)
        var nextTry = retry + 1;
        this.reHideAddressBarTimeout_ = setTimeout(this.retestAndFixUIProxy_, 250 * nextTry, [nextTry, maxTries]); //each fix is progressibily longer (slower phones fix)
      } else if(!this.isFocused_) {
        document.documentElement.style.height = "5000px";
        window.scrollTo(0, 0);
        document.documentElement.style.height = window.innerHeight + "px";
        this.layer.style.height = window.innerHeight + "px";
      }
    },
    getReferenceHeight: function() {
      //the height the page should be at
      if(jq.os.android) {
        return Math.ceil(window.outerHeight / window.devicePixelRatio);
      } else return window.innerHeight;
    },
    getCurrentHeight: function() {
      //the height the page really is at
      if(jq.os.android) {
        return window.innerHeight;
      } else return numOnly(document.documentElement.style.height); //TODO: works well on iPhone, test BB
    },
    onOrientationChange: function(e) {
      //this.log("orientationchange");
      //if a resize already happened, fire the orientationchange
      if(!this.holdingReshapeType_ && this.reshapeTimeout_) {
        this.fireReshapeEvent('orientationchange');
      } else this.previewReshapeEvent('orientationchange');
    },
    onResize: function(e) {
      //avoid infinite loop on iPhone
      if(this.ignoreNextResize_) {
        //this.log('ignored resize');
        this.ignoreNextResize_ = false;
        return;
      }
      //this.logInfo('resize');
      if(this.launchFixUI()) {
        this.reshapeAction();
      }
    },
    onClick: function(e) {
      //handle forms
      var tag = e.target && e.target.tagName != undefined ? e.target.tagName.toLowerCase() : '';

      //this.log("click on "+tag);
      if(inputElements.indexOf(tag) !== -1 && (!this.isFocused_ || !e.target==(this.focusedElement))) {
        var type = e.target && e.target.type != undefined ? e.target.type.toLowerCase() : '';
        var autoBlur = autoBlurInputTypes.indexOf(type) !== -1;

        //focus
        if(!autoBlur) {
          //remove previous blur event if this keeps focus
          if(this.isFocused_) {
            this.focusedElement.removeEventListener('blur', this, false);
          }
          this.focusedElement = e.target;
          this.focusedElement.addEventListener('blur', this, false);
          //android bug workaround for UI
          if(!this.isFocused_ && !this.justBlurred_) {
            //this.log("enter edit mode");
            $.trigger(this, 'enter-edit', [e.target]);
            //fire / preview reshape event
            if($.os.ios) {
              var that = this;
              setTimeout(function() {
                that.fireReshapeEvent('enter-edit');
              }, 300); //TODO: get accurate reading from window scrolling motion and get rid of timeout
            } else this.previewReshapeEvent('enter-edit');
          }
          this.isFocused_ = true;
        } else {
          this.isFocused_ = false;
        }
        this.justBlurred_ = false;
        this.allowDocumentScroll_ = true;

        //fire focus action
        if(requiresJSFocus) {
          e.target.focus();
        }

        //BB10 needs to be preventDefault on touchstart and thus need manual blur on click
      } else if($.os.blackberry10 && this.isFocused_) {
        //this.log("forcing blur on bb10 ");
        this.focusedElement.blur();
      }
    },
    previewReshapeEvent: function(ev) {
      //a reshape event of this type should fire within the next 750 ms, otherwise fire it yourself
      that = this;
      this.reshapeTimeout_ = setTimeout(function() {
        that.fireReshapeEvent(ev);
        that.reshapeTimeout_ = null;
        that.holdingReshapeType_ = null;
      }, 750);
      this.holdingReshapeType_ = ev;
    },
    fireReshapeEvent: function(ev) {
      //this.log(ev?ev+'-reshape':'unknown-reshape');
      $.trigger(this, 'reshape'); //trigger a general reshape notice
      $.trigger(this, ev ? ev + '-reshape' : 'unknown-reshape'); //trigger the specific reshape
    },
    reshapeAction: function() {
      if(this.reshapeTimeout_) {
        //we have a specific reshape event waiting for a reshapeAction, fire it now
        clearTimeout(this.reshapeTimeout_);
        this.fireReshapeEvent(this.holdingReshapeType_);
        this.holdingReshapeType_ = null;
        this.reshapeTimeout_ = null;
      } else this.previewReshapeEvent();
    },
    onFocusIn:function(e){
      if(!this.isFocused_)
        this.onClick(e);
    },
    onBlur: function(e) {
      if(jq.os.android && e.target == window) return; //ignore window blurs

      this.isFocused_ = false;
      //just in case...
      if(this.focusedElement) this.focusedElement.removeEventListener('blur', this, false);
      this.focusedElement = null;
      //make sure this blur is not followed by another focus
      this.justBlurred_ = true;
      $.asap(this.exitEditProxy_, this, [e.target]);
    },
    exitExit: function(element) {
      this.justBlurred_ = false;
      if(!this.isFocused_) {
        //this.log("exit edit mode");
        $.trigger(this, 'exit-edit', [element]);
        //do not allow scroll anymore
        this.allowDocumentScroll_ = false;
        //fire / preview reshape event
        if($.os.ios) {
          var that = this;
          setTimeout(function() {
            that.fireReshapeEvent('exit-edit');
          }, 300); //TODO: get accurate reading from window scrolling motion and get rid of timeout
        } else this.previewReshapeEvent('exit-edit');
      }
    },
    onScroll: function(e) {
      //this.log("document scroll detected "+document.body.scrollTop);
      if(!this.allowDocumentScroll_ && !this.isPanning_ && e.target === (document)) {
        this.allowDocumentScroll_ = true;
        if(this.wasPanning_) {
          this.wasPanning_ = false;
          //give it a couple of seconds
          setTimeout(this.launchFixUIProxy_, 2000, [maxHideTries]);
        } else {
          //this.log("scroll forced page into place");
          this.launchFixUI();
        }
      }
    },

    onTouchStart: function(e) {
      //setup initial touch position
      this.dX = e.touches[0].pageX;
      this.dY = e.touches[0].pageY;
      this.lastTimestamp = e.timeStamp;
      this.lastTouchStartX=this.lastTouchStartY=null;


      //check dom if necessary
      if(requirePanning || $.feat.nativeTouchScroll) this.checkDOMTree(e.target, this.layer);
      //scrollend check
      if(this.isScrolling) {
        //remove prev timeout
        if(this.scrollTimeout_ !== null) {
          clearTimeout(this.scrollTimeout_);
          this.scrollTimeout_ = null;
          //different element, trigger scrollend anyway
          if(this.scrollTimeoutEl_ !== this.scrollingEl_) this.scrollEnded(false);
          else this.blockPossibleClick_ = true;
          //check if event was already set
        } else if(this.scrollTimeoutEl_) {
          //trigger
          this.scrollEnded(true);
          this.blockPossibleClick_ = true;
        }

      }


      // We allow forcing native tap in android devices (required in special cases)
      var forceNativeTap = (jq.os.android && e && e.target && e.target.getAttribute && e.target.getAttribute("data-touchlayer") == "ignore");

      //if on edit mode, allow all native touches
      //(BB10 must still be prevented, always clicks even after move)
      if(forceNativeTap || (this.isFocused_ && !$.os.blackberry10)) {
        this.requiresNativeTap = true;
        this.allowDocumentScroll_ = true;

        //some stupid phones require a native tap in order for the native input elements to work
      } else if(inputElementRequiresNativeTap && e.target && e.target.tagName != undefined) {
        var tag = e.target.tagName.toLowerCase();
        if(inputElements.indexOf(tag) !== -1) {
          //notify scrollers (android forms bug), except for selects
          if(tag != 'select') $.trigger(this, 'pre-enter-edit', [e.target]);
          this.requiresNativeTap = true;
        }
      }
      else if(e.target&&e.target.tagName!==undefined&&e.target.tagName.toLowerCase()=="input"&&e.target.type=="range"){
        this.requiresNativeTap=true;
      }

      //prevent default if possible
      if(!this.isPanning_ && !this.requiresNativeTap) {
        if((this.isScrolling && !$.feat.nativeTouchScroll)||(!this.isScrolling))
          e.preventDefault();
        //demand vertical scroll (don't let it pan the page)
      } else if(this.isScrollingVertical_) {
        this.demandVerticalScroll();
      }
    },
    demandVerticalScroll: function() {
      //if at top or bottom adjust scroll
      var atTop = this.scrollingEl_.scrollTop <= 0;
      if(atTop) {
        //this.log("adjusting scrollTop to 1");
        this.scrollingEl_.scrollTop = 1;
      } else {
        var scrollHeight = this.scrollingEl_.scrollTop + this.scrollingEl_.clientHeight;
        var atBottom = scrollHeight >= this.scrollingEl_.scrollHeight;
        if(atBottom) {
          //this.log("adjusting scrollTop to max-1");
          this.scrollingEl_.scrollTop = this.scrollingEl_.scrollHeight - this.scrollingEl_.clientHeight - 1;
        }
      }
    },
    //set rules here to ignore scrolling check on these elements
    //consider forcing user to use scroller object to assess these... might be causing bugs
    ignoreScrolling: function(element) {
      if(element['scrollWidth'] === undefined || element['clientWidth'] === undefined) return true;
      if(element['scrollHeight'] === undefined || element['clientHeight'] === undefined) return true;
      return false;
    },

    allowsVerticalScroll: function(element, styles) {
      var overflowY = styles.overflowY;
      if(overflowY == 'scroll') return true;
      if(overflowY == 'auto' && element['scrollHeight'] > element['clientHeight']) return true;
      return false;
    },
    allowsHorizontalScroll: function(element, styles) {
      var overflowX = styles.overflowX;
      if(overflowX == 'scroll') return true;
      if(overflowX == 'auto' && element['scrollWidth'] > element['clientWidth']) return true;
      return false;
    },


    //check if pan or native scroll is possible
    checkDOMTree: function(element, parentTarget) {

      //check panning
      //temporarily disabled for android - click vs panning issues
      if(requirePanning && this.panElementId == element.id) {
        this.isPanning_ = true;
        return;
      }
      //check native scroll
      if($.feat.nativeTouchScroll) {

        //prevent errors
        if(this.ignoreScrolling(element)) {
          return;
        }

        //check if vertical or hor scroll are allowed
        var styles = window.getComputedStyle(element);
        if(this.allowsVerticalScroll(element, styles)) {
          this.isScrollingVertical_ = true;
          this.scrollingEl_ = element;
          this.isScrolling = true;
          return;
        } else if(this.allowsHorizontalScroll(element, styles)) {
          this.isScrollingVertical_ = false;
          this.scrollingEl_ = null;
          this.isScrolling = true;
        }

      }
      //check recursive up to top element
      var isTarget = element==(parentTarget);
      if(!isTarget && element.parentNode) this.checkDOMTree(element.parentNode, parentTarget);
    },
    //scroll finish detectors
    scrollEnded: function(e) {
      //this.log("scrollEnded");
      if(e) this.scrollTimeoutEl_.removeEventListener('scroll', this.scrollEndedProxy_, false);
      this.fireEvent('UIEvents', 'scrollend', this.scrollTimeoutEl_, false, false);
      this.scrollTimeoutEl_ = null;
    },


    onTouchMove: function(e) {
      //set it as moved
      var wasMoving = this.moved;
      this.moved = true;
      //very sensitive devices check
      if(verySensitiveTouch) {
        this.cY = e.touches[0].pageY - this.dY;
        this.cX = e.touches[0].pageX - this.dX;
      }
      //panning check
      if(this.isPanning_) {
        return;
      }
      //native scroll (for scrollend)
      if(this.isScrolling) {

        if(!wasMoving) {
          //this.log("scrollstart");
          this.fireEvent('UIEvents', 'scrollstart', this.scrollingEl_, false, false);
        }
        //if(this.isScrollingVertical_) {
        this.speedY = (this.lastY - e.touches[0].pageY) / (e.timeStamp - this.lastTimestamp);
        this.lastY = e.touches[0].pageY;
        this.lastX = e.touches[0].pageX;
        this.lastTimestamp = e.timeStamp;
        //}
      }
      //non-native scroll devices

      if((!$.os.blackberry10 && !this.requiresNativeTap)) {
        //legacy stuff for old browsers
        if(!this.isScrolling ||!$.feat.nativeTouchScroll)
          e.preventDefault();
        return;
      }
      e.stopPropagation();
    },

    onTouchEnd: function(e) {
      if($.os.ios){
        if(skipTouchEnd==e.changedTouches[0].identifier){
          e.preventDefault();
          return false;
        }
        skipTouchEnd=e.changedTouches[0].identifier;
      }
      //double check moved for sensitive devices
      var itMoved = this.moved;
      if(verySensitiveTouch) {
        itMoved = itMoved && !(Math.abs(this.cX) < 10 && Math.abs(this.cY) < 10);
      }

      //don't allow document scroll unless a specific click demands it further ahead
      if(!jq.os.ios || !this.requiresNativeTap) this.allowDocumentScroll_ = false;

      //panning action
      if(this.isPanning_ && itMoved) {
        //wait 2 secs and cancel
        this.wasPanning_ = true;

        //a generated click
      } else if(!itMoved && !this.requiresNativeTap) {

        //NOTE: on android if touchstart is not preventDefault(), click will fire even if touchend is prevented
        //this is one of the reasons why scrolling and panning can not be nice and native like on iPhone
        e.preventDefault();

        //fire click
        if(!this.blockClicks && !this.blockPossibleClick_) {
          var theTarget = e.target;
          if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
          this.fireEvent('Event', 'click', theTarget, true, e.mouseToTouch,e.changedTouches[0]);
          this.lastTouchStartX=this.dX;
          this.lastTouchStartY=this.dY;
        }

      } else if(itMoved) {
        //setup scrollend stuff
        if(this.isScrolling) {
          this.scrollTimeoutEl_ = this.scrollingEl_;
          if(Math.abs(this.speedY) < 0.01) {
            //fire scrollend immediatly
            //this.log(" scrollend immediately "+this.speedY);
            this.scrollEnded(false);
          } else {
            //wait for scroll event
            //this.log($.debug.since()+" setting scroll timeout "+this.speedY);
            this.scrollTimeout_ = setTimeout(this.scrollTimeoutExpireProxy_, 30)
          }
        }
        //trigger cancel-enter-edit on inputs
        if(this.requiresNativeTap) {
          if(!this.isFocused_) $.trigger(this, 'cancel-enter-edit', [e.target]);
        }
      }
      this.clearTouchVars();
    },

    clearTouchVars: function() {
      //this.log("clearing touchVars");
      this.speedY = this.lastY = this.cY = this.cX = this.dX = this.dY = 0;
      this.moved = false;
      this.isPanning_ = false;
      this.isScrolling = false;
      this.isScrollingVertical_ = false;
      this.requiresNativeTap = false;
      this.blockPossibleClick_ = false;
    },

    fireEvent: function(eventType, eventName, target, bubbles, mouseToTouch,data) {
      //this.log("Firing event "+eventName);
      //create the event and set the options
      var theEvent = document.createEvent(eventType);
      theEvent.initEvent(eventName, bubbles, true);
      theEvent.target = target;
      if(data){
        $.each(data,function(key,val){
          theEvent[key]=val;
        });
      }
      //jq.DesktopBrowsers flag
      if(mouseToTouch) theEvent.mouseToTouch = true;
      target.dispatchEvent(theEvent);
    }
  };

})();
//Touch events are from zepto/touch.js
(function($) {
  var touch = {}, touchTimeout;

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode;
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
    if (xDelta >= yDelta) {
      return (x1 - x2 > 0 ? 'Left' : 'Right');
    } else {
      return (y1 - y2 > 0 ? 'Up' : 'Down');
    }
  }

  var longTapDelay = 750;
  function longTap() {
    if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
      touch.element.trigger('longTap');
      touch = {};
    }
  }
  var longTapTimer;
  $(document).ready(function() {
    var prevEl;
    $(document.body).bind('touchstart', function(e) {
      if(!e.touches||e.touches.length==0) return;
      var now = Date.now(), delta = now - (touch.last || now);
      if(!e.touches||e.touches.length==0) return;
      touch.element = $(parentIfText(e.touches[0].target));
      touchTimeout && clearTimeout(touchTimeout);
      touch.x1 =  e.touches[0].pageX;
      touch.y1 = e.touches[0].pageY;
      touch.x2=touch.y2=0;
      if (delta > 0 && delta <= 250)
        touch.isDoubleTap = true;
      touch.last = now;
      longTapTimer=setTimeout(longTap, longTapDelay);
      if (!touch.element.data("ignore-pressed"))
        touch.element.addClass("selected");
      if(prevEl&&!prevEl.data("ignore-pressed"))
        prevEl.removeClass("selected");
      prevEl=touch.element;
    }).bind('touchmove', function(e) {
          touch.x2 = e.touches[0].pageX;
          touch.y2 = e.touches[0].pageY;
          clearTimeout(longTapTimer);
        }).bind('touchend', function(e) {

          if (!touch.element)
            return;
          if (!touch.element.data("ignore-pressed"))
            touch.element.removeClass("selected");
          if (touch.isDoubleTap) {
            touch.element.trigger('doubleTap');
            touch = {};
          } else if (touch.x2 > 0 || touch.y2 > 0) {
            (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) &&
                touch.element.trigger('swipe') &&
            touch.element.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
            touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
          } else if ('last' in touch) {
            touch.element.trigger('tap');


            touchTimeout = setTimeout(function() {
              touchTimeout = null;
              if (touch.element)
                touch.element.trigger('singleTap');
              touch = {};
            }, 250);
          }
        }).bind('touchcancel', function() {
          if(touch.element&& !touch.element.data("ignore-pressed"))
            touch.element.removeClass("selected");
          touch = {};
          clearTimeout(longTapTimer);

        });
  });

  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m) {
    $.fn[m] = function(callback) {
      return this.bind(m, callback)
    }
  });
})(jq);
(function ($) {
  //when doc ready, add the touch layer
  $(document).ready(function () {
    if ($.os.supportsTouch) {
      $.touch_layer(document.getElementById("ui_kit"));
    }
  });

//If the document is ready, call autoBoot to launch
  if (document.readyState === 'complete' || document.readyState === "loaded") {
    $.ui.autoBoot();
  }
//Otherwise add a listener and launch when ready
  else {
    document.addEventListener("DOMContentLoaded", function () {
      $.ui.autoBoot();
      this.removeEventListener("DOMContentLoaded", arguments.callee);
    }, false);
  }
})(jq);


//var global = {
//  current_nav_id: '',
//  last_click: '',
//  cached_pages: []
//};
//
////Before finishing up this page, check out more of the jqUI code
//
//
//(function($){
//
//  $.set_active_nav = function set_active_nav(div_id){
//    $(global.current_nav_id).removeClass('active_footer_button');
//    $(div_id).addClass('active_footer_button');
//    global.current_nav_id = div_id;
//  };
//
//
//
//  $.show_page = function show_page(options){
//
//    if (options.active_nav && (options.active_nav != global.current_nav){
//      $.set_active_nav(options.active_nav);
//    }
//
//    //if there's a remote url we need to get go here
//    if(options.api_url){
//      //if we have a local cache of the page, use it first
//      if ( global.cached_pages[options.div_id] ) {
//        load page with it
//          do ajax request (on success, update contents)
//      }
//      else {
//        //load spinner while we get the data
//        //TODO loadspinner
//        $.get_with_token({
//          api_url: options.api_url,
//          data: options.data,
//          success: function(){
//
//          },
//          error: function(){
//
//          }
//      });
//      }
//    }
//
//
//    //else {
//    //    load spinner
//    //    ajax request(on success, remove spinner + load content)
//    //}
//
//
//    if ($('#' + options.div_id).length == 0) {
//      $.ui.add_content_div(options.div_id,
//          $.template(options.template), options.title, options.data);
//    }
//    //otherwise, update the content inside
//    else {
//      $.ui.update_content_div(options.div_id, $.template(options.template), options.data);
//    }
//    //trigger the page transition/navigation event
//    //These 4 things are ____??? Get from the API
//    $.ui.load_content('user_index_view', false, false, 'fade');
//
//
//
//    if
//
//    title: 'FunLife',
//        active_nav: '#bottom_nav_home',
//        div_id: 'user_index_view',
//        template: 'views/users/user_index_view.js',
//        left_button: true,
//        api_url: '/users/',
//        data: {}
//
//
//  };
//
//
//
//  $.get_with_token = function get_with_token(options, data){
//
//  };
//
//
//  $.post_with_token = function post_with_token(options){
//
//  };
//
//
//})(jq);

(function($ui){

  function flipTransition (old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this
    if (back) {
      that.css3animate(current_div, {
        x: "100%",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(current_div, {
            x: "0%",
            scale: 1,
            time: "150ms",
            rotateY: "0deg",
            complete: function(){
              that.clearAnimations(current_div);
            }
          });
        }
      });
      that.css3animate(old_div, {
        x: "100%",
        time: "150ms",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(old_div, {
            x: "-100%",
            opacity: 1,
            scale: 1,
            rotateY: "0deg",
            complete: function() {
              that.finishTransition(old_div);
            }
          });
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      old_div.style.zIndex = 1;
      current_div.style.zIndex = 2;
      that.css3animate(old_div, {
        x: "100%",
        time: "150ms",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(old_div, {
            x: "-100%",
            y: 0,
            time: "1ms",
            scale: 1,
            rotateY: "0deg",
            complete: function() {
              that.finishTransition(old_div);
            }
          });
        }
      });
      that.css3animate(current_div, {
        x: "100%",
        time: "1ms",
        scale: .8,
        rotateY: "180deg",
        complete: function() {
          that.css3animate(current_div, {
            x: "0%",
            time: "150ms",
            scale: 1,
            rotateY: "0deg",
            complete:function(){
              that.clearAnimations(current_div);
            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.flip = flipTransition;
})($.ui);

/**
 * jq.web.actionsheet - a actionsheet for html5 mobile apps
 * Copyright 2012 - Intel 
 */
(function($) {
    $.fn["actionsheet"] = function(opts) {
        var tmp;
        for (var i = 0; i < this.length; i++) {
            tmp = new actionsheet(this[i], opts);
        }
        return this.length == 1 ? tmp : this;
    };
    var actionsheet = (function() {
        var actionsheet = function(elID, opts) {
            if (typeof elID == "string" || elID instanceof String) {
                this.el = document.getElementById(elID);
            } else {
                this.el = elID;
            }
            if (!this.el) {
                alert("Could not find element for actionsheet " + elID);
                return;
            }
            
            if (this instanceof actionsheet) {
                if(typeof(opts)=="object"){
                for (j in opts) {
                    this[j] = opts[j];
                }
                }
            } else {
                return new actionsheet(elID, opts);
            }
            
            try {
                var that = this;
                var markStart = '<div id="jq_actionsheet"><div style="width:100%">';
                var markEnd = '</div></div>';
                var markup;
                if (typeof opts == "string") {
                    markup = $(markStart + opts +"<a href='javascript:;' class='cancel'>Cancel</a>"+markEnd);
                } else if (typeof opts == "object") {
                    markup = $(markStart + markEnd);
                    var container = $(markup.children().get());
                    opts.push({text:"Cancel",cssClasses:"cancel"});
                    for (var i = 0; i < opts.length; i++) {
                        var item = $('<a href="javascript:;" >' + (opts[i].text || "TEXT NOT ENTERED") + '</a>');
                        item[0].onclick = (opts[i].handler || function() {});
                        if (opts[i].cssClasses && opts[i].cssClasses.length > 0)
                            item.addClass(opts[i].cssClasses);
                        container.append(item);
                    }
                }
                $(elID).find("#jq_actionsheet").remove();
                $(elID).find("#jq_action_mask").remove();
                actionsheetEl = $(elID).append(markup);
                
                markup.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
                markup.css($.feat.cssPrefix+"Transform",  "translate"+$.feat.cssTransformStart+"0,0"+$.feat.cssTransformEnd);
                markup.css("top",window.innerHeight+"px");
                this.el.style.overflow = "hidden";
                markup.on("click", "a",function(){that.hideSheet()});
                this.activeSheet=markup;
                $(elID).append('<div id="jq_action_mask" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;z-index:9998;background:rgba(0,0,0,.4)"/>');
                setTimeout(function(){
                    markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";
                    markup.css($.feat.cssPrefix+"Transform", "translate"+ $.feat.cssTransformStart+"0,"+(-(markup.height()))+"px"+$.feat.cssTransformEnd);
                 },10);
            } catch (e) {
                alert("error adding actionsheet" + e);
            }
        };
        actionsheet.prototype = {
            activeSheet:null,
            hideSheet: function() {
                var that=this;
                this.activeSheet.off("click","a",function(){that.hideSheet()});
                $(this.el).find("#jq_action_mask").remove();
                this.activeSheet.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
                var markup = this.activeSheet;
                var theEl = this.el;
                setTimeout(function(){
                    
                	markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";

                	markup.css($.feat.cssPrefix+"Transform", "translate"+$.feat.cssTransformStart+"0,0px"+$.feat.cssTransformEnd);
                	setTimeout(function(){
		                markup.remove();
		                markup=null;
		                theEl.style.overflow = "none";
	                },500);
                },10);            
            }
        };
        return actionsheet;
    })();
})(jq);

/**
 * $.alphaTable - a list table for jqMobi apps
 * 
 * @copyright 2011 - Intel
 * 
 */ (function ($) {
    $.fn["alphatable"] = function (scroller, opts) {
        var tmp;
        for (var i = 0; i < this.length; i++) {
            tmp = new alphaTable(this[i], scroller, opts);

        }
        return this.length == 1 ? tmp : this;
    };

    var alphaTable = (function () {
        var translateOpen =$.feat.cssTransformStart;
        var translateClose = $.feat.cssTransformEnd;
        var alphaTable = function (el, scroller, opts) {

                if (typeof el == "string") el = document.getElementById(el);
                this.container = el.parentNode;
                if (!this.container) {
                    alert("Error finding container for alphaTable " + el);
                    return;
                }
                if (this instanceof alphaTable) {
                    for (j in opts) {
                        this[j] = opts[j];
                    }
                } else {
                    return new alphaTable(el, scroller, opts);
                }
                if (!scroller || typeof (scroller) != "object") {
                    return alert("Error: Please include an jq.web.scroll object to use this");
                }
                this.scroller = scroller;

                this.el = el;
                this.setupIndex();
                this.setupLetterBox();
            };

        alphaTable.prototype = {
            listCssClass: "",
            letterBox: null,
            isMoving: false,
            prefix: "",
            scrollToLetter: function (letter) {
                var el = document.getElementById(this.prefix + letter);
                if (el) {
                    var yPos = -el.offsetTop;
                    this.scroller.scrollTo({
                        x: 0,
                        y: yPos
                    });
                }
            },
            setupIndex: function () {
                var arrAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                var that = this;
                var containerDiv = document.createElement("div");
                containerDiv.id = "indexDIV_" + this.el.id;
                containerDiv.style.cssText = "position:absolute;top:0px;right:20px;width:20px;font-size:6pt;font-weight:bold;color:#000;opacity:.5;border-radius:5px;text-align:center;z-index:9999;border:1px solid black;background:#666;padding-top:5px;padding-bottom:5px;";
                containerDiv.className = this.listCssClass;                
                containerDiv.addEventListener("touchend", function (event) {
                    that.isMoving = false;
                    that.clearLetterBox()
                }, false);
                //To allow updating as we "scroll" with our finger, we need to capture the position on the containerDiv element and calculate the Y coordinates.
                //On mobile devices, you can not do an "onmouseover" over multiple items and trigger events.
                containerDiv.addEventListener("touchstart", function (event) {

                    
                    if(event.touches[0].target==this) return;
                    that.isMoving = true;
                    
                    var letter = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                    if(!letter||!letter.getAttribute("alphatable-item")||letter.getAttribute("alphatable-item").length==0)
                       var letter = event.touches[0].target;

                    if(letter.innerHTML.length>1) return;
                    that.showLetter(letter.innerHTML);
                    that.scrollToLetter(letter.innerHTML);
                    event.preventDefault();
                    event.stopPropagation();
                }, false);
                containerDiv.addEventListener("touchmove", function (event) {
                    var letter = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                    if(!letter||!letter.getAttribute("alphatable-item")||letter.getAttribute("alphatable-item").length==0)
                       var letter = event.touches[0].target;
                    if(letter.innerHTML.length>1) return;
                    if (!that.isMoving) return;
                    that.showLetter(letter.innerHTML);
                    that.scrollToLetter(letter.innerHTML);
                    event.preventDefault();
                }, false);

                //Create the alphabet
                for (i = 0; i < arrAlphabet.length; i++) {
                    var tmpDiv = document.createElement("div");
                    tmpDiv.innerHTML = arrAlphabet[i];
                    tmpDiv.setAttribute("alphatable-item","true");
                    containerDiv.appendChild(tmpDiv);
                }
                this.container.appendChild(containerDiv);

                var clientHeight = numOnly(containerDiv.clientHeight) - numOnly(containerDiv.style.top) - numOnly(containerDiv.style.paddingTop);
                this.scroller.scrollTo({
                    x: 0,
                    y: 0
                }); //There's a bug with webkit and css3.  The letterbox would not show until -webkit-transform as applied.
                containerDiv = null;

            },
            showLetter: function (letter) {
                var that = this;
                this.letterBox.style.display = "block";
                if (this.letterBox.innerHTML != letter) {
                    that.letterBox.innerHTML = letter
                }

            },
            clearLetterBox: function () {
                this.letterBox.style.display = "none";
                this.letterBox.innerHTML = "";
            },
            setupLetterBox: function () {
                var div = document.createElement("div");
                div.style.cssText = $.feat.cssPrefix+"-transform:translate3d(0,0,0);display:none;position:absolute;top:35%;left:35%;height:2em;width:15%;line-height:2em;text-align:center;font-size:2em;color:blue;background:#666;z-index:999999;border:1px solid black;border-raidus:10px;";
                div.className = this.letterBoxCssClass;
                div.innerHTML = "";
                this.letterBox = div;
                this.container.appendChild(div);
                div = null;

            }
        };
        return alphaTable;
    })();
})(jq);
/**
 * jq.web.carousel - a carousel library for html5 mobile apps
 * @copyright 2011 - Intel
 * 
 */
(function($) {
    var cache = [];
    var objId=function(obj){
        if(!obj.jqmCarouselId) obj.jqmCarouselId=$.uuid();
        return obj.jqmCarouselId;
    }
    $.fn.carousel = function(opts) {
        var tmp, id;
        for (var i = 0; i < this.length; i++) {
            //cache system
            id = objId(this[i]);
            if(!cache[id]){
                tmp = new carousel(this[i], opts);
                cache[id] = tmp;
            } else {
                tmp = cache[id];
            }
        }
        return this.length == 1 ? tmp : this;
    };
    
    var carousel = (function() {
        var translateOpen =$.feat.cssTransformStart;
        var translateClose = $.feat.cssTransformEnd;
        
        var carousel = function(containerEl, opts) {
            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                alert("Error finding container for carousel " + containerEl);
                return;
            }
            if (this instanceof carousel) {
                for (var j in opts) {
                    if (opts.hasOwnProperty(j)) {
                        this[j] = opts[j];
                    }
                }
            } else {
                
                return new carousel(containerEl, opts);
            }
        
                 
                var that = this;
                jq(this.container).bind('destroy', function(e){
                    var id = that.container.jqmCarouselId;
                    //window event need to be cleaned up manually, remaining binds are automatically killed in the dom cleanup process
                   window.removeEventListener("orientationchange", that.orientationHandler, false);
                   if(cache[id]) delete cache[id];
                   e.stopPropagation();
                });
                
                this.pagingDiv = this.pagingDiv ? document.getElementById(this.pagingDiv) : null;


                // initial setup
                this.container.style.overflow = "hidden";
                if (this.vertical) {
                    this.horizontal = false;
                }
                
                var el = document.createElement("div");
                this.container.appendChild(el);
                var $el=$(el);
                var $container=$(this.container);
                var data = Array.prototype.slice.call(this.container.childNodes);
                while(data.length>0)
                {
                    var myEl=data.splice(0,1);
                    myEl=$container.find(myEl)
                    if(myEl.get()==el)
                       continue;
                    $el.append(myEl.get());
                }
                if (this.horizontal) {
                    el.style.display = "block";
                    el.style['float']="left";
                } 
                else {
                    el.style.display = "block";
                }
                
                this.el = el;
                this.refreshItems();
                var jqEl = jq(el);
                jqEl.bind('touchmove', function(e) {that.touchMove(e);});
                jqEl.bind('touchend', function(e) {that.touchEnd(e);});
                jqEl.bind('touchstart', function(e) {that.touchStart(e);});
                this.orientationHandler = function() {that.onMoveIndex(that.carouselIndex,0);};
                window.addEventListener("orientationchange", this.orientationHandler, false);
           
        };
        
        carousel.prototype = {
            startX: 0,
            startY: 0,
            dx: 0,
            dy: 0,
            glue: false,
            myDivWidth: 0,
            myDivHeight: 0,
            cssMoveStart: 0,
            childrenCount: 0,
            carouselIndex: 0,
            vertical: false,
            horizontal: true,
            el: null,
            movingElement: false,
            container: null,
            pagingDiv: null,
            pagingCssName: "carousel_paging",
            pagingCssNameSelected: "carousel_paging_selected",
            pagingFunction: null,
            lockMove:false,
            okToMove: false,
       
            // handle the moving function
            touchStart: function(e) {
                this.okToMove = false;
                this.myDivWidth = numOnly(this.container.clientWidth);
                this.myDivHeight = numOnly(this.container.clientHeight);
                this.lockMove=false;
                if (e.touches[0].target && e.touches[0].target.type !== undefined) {
                    var tagname = e.touches[0].target.tagName.toLowerCase();
                    if (tagname === "select" || tagname === "input" || tagname === "button")  // stuff we need to allow
                    {
                        return;
                    }
                }
                if (e.touches.length === 1) {
                    
                    this.movingElement = true;
                    this.startY = e.touches[0].pageY;
                    this.startX = e.touches[0].pageX;
                    var cssMatrix=$.getCssMatrix(this.el);

                    if (this.vertical) {
                        try {
                            this.cssMoveStart = numOnly(cssMatrix.f);
                        } catch (ex1) {
                            this.cssMoveStart = 0;
                        }
                    } else {
                        try {
                            this.cssMoveStart = numOnly(cssMatrix.e);
                        } catch (ex1) {
                            this.cssMoveStart = 0;
                        }
                    }
                }
            },
            touchMove: function(e) {
                if(!this.movingElement)
                   return;
                if (e.touches.length > 1) {
                    return this.touchEnd(e);
                }
                
                var rawDelta = {
                    x: e.touches[0].pageX - this.startX,
                    y: e.touches[0].pageY - this.startY
                };
                
                if (this.vertical) {
                    var movePos = { x: 0, y: 0 };
                    this.dy = e.touches[0].pageY - this.startY;
                    
                    this.dy += this.cssMoveStart;
                    movePos.y = this.dy;

                    e.preventDefault();
                    //e.stopPropagation();
                } else {
                    if (!this.lockMove&&isHorizontalSwipe(rawDelta.x, rawDelta.y)) {
                         
                        var movePos = {x: 0,y: 0};
                        this.dx = e.touches[0].pageX - this.startX;
                        this.dx += this.cssMoveStart;
                        e.preventDefault();
                      //  e.stopPropagation();
                        movePos.x = this.dx;
                    }
                    else
                       return this.lockMove=true;
                }
                
                var totalMoved = this.vertical ? ((this.dy % this.myDivHeight) / this.myDivHeight * 100) * -1 : ((this.dx % this.myDivWidth) / this.myDivWidth * 100) * -1; // get a percentage of movement.
      
                if (!this.okToMove) {
                    oldStateOkToMove= this.okToMove;
                    this.okToMove = this.glue ? Math.abs(totalMoved) > this.glue  && Math.abs(totalMoved) < (100 - this.glue) : true;
                    if (this.okToMove && !oldStateOkToMove) {
                    	$.trigger(this,"movestart",[this.el]);
                    }
                }
                	
                if  (this.okToMove && movePos) 
                   this.moveCSS3(this.el, movePos);
                   
            },
            touchEnd: function(e) {
                if (!this.movingElement) {
                    return;
                }
                $.trigger(this,"movestop",[this.el]);
                // e.preventDefault();
                // e.stopPropagation();
                var runFinal = false;
                try {
                    var cssMatrix=$.getCssMatrix(this.el);
                    var endPos = this.vertical ? numOnly(cssMatrix.f) : numOnly(cssMatrix.e);
                    
                    if (1==2&&endPos > 0) {
                        this.moveCSS3(this.el, {
                            x: 0,
                            y: 0
                        }, "300");
                    } else {
                        var totalMoved = this.vertical ? ((this.dy % this.myDivHeight) / this.myDivHeight * 100) * -1 : ((this.dx % this.myDivWidth) / this.myDivWidth * 100) * -1; // get a percentage of movement.
                        // Only need
                        // to drag 3% to trigger an event
                        var currInd = this.carouselIndex;
                        if (endPos < this.cssMoveStart && totalMoved > 3) {
                            currInd++; // move right/down
                        } else if ((endPos > this.cssMoveStart && totalMoved < 97)) {
                            currInd--; // move left/up
                        }
                        var toMove=currInd;
                        //Checks for infinite - moves to placeholders
                        if (currInd > (this.childrenCount - 1)) {
                            currInd = 0;
                            toMove=this.childrenCount;
                        }
                        if (currInd < 0) {
                            currInd = this.childrenCount-1;
                            toMove=-1;
                        }
                        var movePos = {
                            x: 0,
                            y: 0
                        };
                        if (this.vertical) {
                            movePos.y = (toMove * this.myDivHeight * -1);
                        } 
                        else {
                            movePos.x = (toMove * this.myDivWidth * -1);
                        }
                        
                        this.moveCSS3(this.el, movePos, "150");
                        
                        if (this.pagingDiv && this.carouselIndex !== currInd) {
                            document.getElementById(this.container.id + "_" + this.carouselIndex).className = this.pagingCssName;
                            document.getElementById(this.container.id + "_" + currInd).className = this.pagingCssNameSelected;
                        }
                        if (this.carouselIndex != currInd)
                            runFinal = true;
                        this.carouselIndex = currInd;
                        
                        //This is for the infinite ends - will move to the correct position after animation
                        if(toMove!=currInd){
                            var that=this;
                            window.setTimeout(function(){
                                that.onMoveIndex(currInd,"1ms");
                            },155);
                        }
                    }
                } catch (e) {
                    0;
                }
                this.dx = 0;
                this.movingElement = false;
                this.startX = 0;
                this.dy = 0;
                this.startY = 0;
                if (runFinal && this.pagingFunction && typeof this.pagingFunction == "function")
                    this.pagingFunction(this.carouselIndex);
            },
            onMoveIndex: function(newInd,transitionTime) {
                
                this.myDivWidth = numOnly(this.container.clientWidth);
                this.myDivHeight = numOnly(this.container.clientHeight);
                var runFinal = false;

                    if(document.getElementById(this.container.id + "_" + this.carouselIndex))
                        document.getElementById(this.container.id + "_" + this.carouselIndex).className = this.pagingCssName;

                    var newTime = Math.abs(newInd - this.carouselIndex);
                    
                    var ind = newInd;
                    if (ind < 0)
                        ind = 0;
                    if (ind > this.childrenCount - 1) {
                        ind = this.childrenCount - 1;
                    }
                    var movePos = {
                        x: 0,
                        y: 0
                    };
                    if (this.vertical) {
                        movePos.y = (ind * this.myDivHeight * -1);
                    } 
                    else {
                        movePos.x = (ind * this.myDivWidth * -1);
                    }
                    
                    var time =transitionTime?transitionTime: 50 + parseInt((newTime * 20));
                    this.moveCSS3(this.el, movePos, time);
                    if (this.carouselIndex != ind)
                        runFinal = true;
                    this.carouselIndex = ind;
                    if (this.pagingDiv) {
                        var tmpEl = document.getElementById(this.container.id + "_" + this.carouselIndex);
                        if(tmpEl) tmpEl.className = this.pagingCssNameSelected;
                    }
               
                if (runFinal && this.pagingFunction && typeof this.pagingFunction == "function")
                    this.pagingFunction(currInd);
            },
            
            moveCSS3: function(el, distanceToMove, time, timingFunction) {
                if (!time)
                    time = 0;
                else
                    time = parseInt(time);
                if (!timingFunction)
                    timingFunction = "linear";
                el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
                el.style[$.feat.cssPrefix+"TransitionDuration"] = time + "ms";
                el.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
                el.style[$.feat.cssPrefix+"TransformStyle"] = "preserve-3d";
                el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
            },
            
            addItem: function(el) {
                if (el && el.nodeType) {
                    
                    this.container.childNodes[0].appendChild(el);
                    this.refreshItems();
                }
            },
            refreshItems: function() {
                var childrenCounter = 0;
                var that = this;
                var el = this.el;
                $(el).children().find(".prevBuffer").remove();
                $(el).children().find(".nextBuffer").remove();
                n = el.childNodes[0];
                var widthParam;
                var heightParam = "100%";
                var elems = [];

                for (; n; n = n.nextSibling) {
                    if (n.nodeType === 1) {
                        elems.push(n);
                        childrenCounter++;
                    }
                }
                //Let's put the buffers at the start/end
                
                var prep=$(elems[elems.length-1]).clone().get(0);
                $(el).prepend(prep);
                var tmp=$(elems[0]).clone().get(0);
                $(el).append(tmp);
                elems.push(tmp);
                elems.unshift(prep);
                
                var param = (100 / childrenCounter) + "%";
                this.childrenCount = childrenCounter;
                widthParam = parseFloat(100 / childrenCounter) + "%";
                
                for (var i = 0; i < elems.length; i++) {
                    if (this.horizontal) {
                        elems[i].style.width = widthParam;
                        elems[i].style.height = "100%";
                        elems[i].style['float']="left";
                    } 
                    else {
                        elems[i].style.height = widthParam;
                        elems[i].style.width = "100%";
                        elems[i].style.display = "block";
                    }
                }
                //Clone the first and put it at the end
                tmp.style.position="absolute";
                prep.style.position="absolute";

                this.moveCSS3(el, {
                    x: 0,
                    y: 0
                });
                if (this.horizontal) {
                    el.style.width = Math.ceil((this.childrenCount) * 100) + "%";
                    el.style.height = "100%";
                    el.style['min-height'] = "100%"
                    prep.style.left="-"+widthParam;
                    tmp.style.left="100%";
                } 
                else {
                    el.style.width = "100%";
                    el.style.height = Math.ceil((this.childrenCount) * 100) + "%";
                    el.style['min-height'] = Math.ceil((this.childrenCount) * 100) + "%";
                    prep.style.top="-"+widthParam;
                    tmp.style.top="100%";
                }
                // Create the paging dots
                if (this.pagingDiv) {
                    this.pagingDiv.innerHTML = ""
                    for (i = 0; i < this.childrenCount; i++) {
                        
                        var pagingEl = document.createElement("div");
                        pagingEl.id = this.container.id + "_" + i;
                        pagingEl.pageId = i;
                        if (i !== this.carouselIndex) {
                            pagingEl.className = this.pagingCssName;
                        } 
                        else {
                            pagingEl.className = this.pagingCssNameSelected;
                        }
                        pagingEl.onclick = function() {
                            that.onMoveIndex(this.pageId);
                        };
                        var spacerEl = document.createElement("div");
                     
                        spacerEl.style.width = "20px";
                        if(this.horizontal){
                            spacerEl.style.display = "inline-block";
                            spacerEl.innerHTML = "&nbsp;";
                        }
                        else{
                           spacerEl.innerHTML="&nbsp;";
                           spacerEl.style.display="block";
                        }
                        
                        this.pagingDiv.appendChild(pagingEl);
                        if (i + 1 < (this.childrenCount))
                            this.pagingDiv.appendChild(spacerEl);
                        pagingEl = null;
                        spacerEl = null;
                    }
                    if(this.horizontal){
                        this.pagingDiv.style.width = (this.childrenCount) * 50 + "px";
                        this.pagingDiv.style.height = "25px";
                    }
                    else {
                        this.pagingDiv.style.height = (this.childrenCount) * 50 + "px";
                        this.pagingDiv.style.width = "25px";
                    }
                }
                this.onMoveIndex(this.carouselIndex);
                
            }
        
        };
        return carousel;
    })();
    
    function isHorizontalSwipe(xAxis, yAxis) {
                var X = xAxis;
                var Y = yAxis;
                var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
                var r = Math.atan2(Y,X); //angle in radians 
                var swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
                if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); } // for negative degree values
                if (((swipeAngle <= 215) && (swipeAngle >= 155)) || ((swipeAngle <= 45) && (swipeAngle >= 0)) || ((swipeAngle <= 360) && (swipeAngle >= 315))) // horizontal angles with threshold
                {return true; }
                else {return false}
    }
    
})(jq);

(function ($) {
    var cache = [];
    var objId=function(obj){
        if(!obj.jqmCSS3AnimateId) obj.jqmCSS3AnimateId=$.uuid();
        return obj.jqmCSS3AnimateId;
    }
    var getEl=function(elID){
        if (typeof elID == "string" || elID instanceof String) {
            return document.getElementById(elID);
        } else if($.is$(elID)){
            return elID[0];
        } else {
            return elID;
        }
    }
    var getCSS3Animate=function(obj, options){
        var tmp, id, el = getEl(obj);
        //first one
        id = objId(el);
        if(cache[id]){
            cache[id].animate(options);
            tmp = cache[id];
        } else {
            tmp = css3Animate(el, options);
            cache[id] = tmp;
        }
        return tmp;
    }
    $.fn["css3Animate"] = function (opts) {
        //keep old callback system - backwards compatibility - should be deprecated in future versions
        if(!opts.complete && opts.callback) opts.complete = opts.callback;
        //first on
        var tmp = getCSS3Animate(this[0], opts);
        opts.complete=null;
        opts.sucess=null;
        opts.failure=null;
        for (var i = 1; i < this.length; i++) {
            tmp.link(this[i], opts);
        }
        return tmp;
    };
    

    $["css3AnimateQueue"] = function () {
        return new css3Animate.queue();
    }

    //if (!window.WebKitCSSMatrix) return;
    var translateOpen =$.feat.cssTransformStart;
    var translateClose = $.feat.cssTransformEnd;
    var transitionEnd=$.feat.cssPrefix.replace(/-/g,"")+"TransitionEnd";
    transitionEnd=($.os.fennec||$.feat.cssPrefix==""||$.os.ie)?"transitionend":transitionEnd;

    transitionEnd=transitionEnd.replace(transitionEnd.charAt(0),transitionEnd.charAt(0).toLowerCase());
    
    var css3Animate = (function () {
        
        var css3Animate = function (elID, options) {
            if(!(this instanceof css3Animate)) return new css3Animate(elID, options);
            
            //start doing stuff
            this.callbacksStack = [];
            this.activeEvent = null;
            this.countStack = 0;
            this.isActive = false;
            this.el = elID;
            this.linkFinishedProxy_ = $.proxy(this.linkFinished, this);
            
            if (!this.el) return;
            
            this.animate(options);
            
            var that = this;
            jq(this.el).bind('destroy', function(){
                var id = that.el.jqmCSS3AnimateId;
                that.callbacksStack = [];
                if(cache[id]) delete cache[id];
            });
        };
        css3Animate.prototype = {
            animate:function(options){
                
                //cancel current active animation on this object
                if(this.isActive) this.cancel();
                this.isActive = true;
                
                if (!options) {
                    alert("Please provide configuration options for animation of " + this.el.id);
                    return;
                }
            
                var classMode = !!options["addClass"];
            
                if(classMode){
                    //class defines properties being changed
                    if(options["removeClass"]){
                        jq(this.el).replaceClass(options["removeClass"], options["addClass"]);
                    } else {
                        jq(this.el).addClass(options["addClass"]);
                    }
                
                } else {
                    //property by property
                    var timeNum = numOnly(options["time"]);
                    if(timeNum==0) options["time"]=0;
                
                    if (!options["y"]) options["y"] = 0;
                    if (!options["x"]) options["x"] = 0;
                    if (options["previous"]) {
                        var cssMatrix = new $.getCssMatrix(this.el);
                        options.y += numOnly(cssMatrix.f);
                        options.x += numOnly(cssMatrix.e);
                    }
                    if (!options["origin"]) options.origin = "0% 0%";

                    if (!options["scale"]) options.scale = "1";

                    if (!options["rotateY"]) options.rotateY = "0";
                    if (!options["rotateX"]) options.rotateX = "0";
                    if (!options["skewY"]) options.skewY = "0";
                    if (!options["skewX"]) options.skewX = "0";


                    if (!options["timingFunction"]) options["timingFunction"] = "linear";

                    //check for percent or numbers
                    if (typeof (options.x) == "number" || (options.x.indexOf("%") == -1 && options.x.toLowerCase().indexOf("px") == -1 && options.x.toLowerCase().indexOf("deg") == -1)) options.x = parseInt(options.x) + "px";
                    if (typeof (options.y) == "number" || (options.y.indexOf("%") == -1 && options.y.toLowerCase().indexOf("px") == -1 && options.y.toLowerCase().indexOf("deg") == -1)) options.y = parseInt(options.y) + "px";
                    
                    var trans= "translate" + translateOpen + (options.x) + "," + (options.y) + translateClose + " scale(" + parseFloat(options.scale) + ") rotate(" + options.rotateX + ")";
                    if(!$.os.opera)
                        trans+=" rotateY(" + options.rotateY + ")";
                    trans+=" skew(" + options.skewX + "," + options.skewY + ")";
                    this.el.style[$.feat.cssPrefix+"Transform"]=trans;
                    this.el.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
                    var properties = $.feat.cssPrefix+"Transform";
                    if (options["opacity"]!==undefined) {
                        this.el.style.opacity = options["opacity"];
                        properties+=", opacity";
                    }
                    if (options["width"]) {
                        this.el.style.width = options["width"];
                        properties = "all";
                    }
                    if (options["height"]) {
                        this.el.style.height = options["height"];
                        properties = "all";
                    }
                    this.el.style[$.feat.cssPrefix+"TransitionProperty"] = "all";
                
                    if((""+options["time"]).indexOf("s")===-1) {
                        var scale = 'ms';
                        var time = options["time"]+scale;
                    } else if(options["time"].indexOf("ms")!==-1){
                        var scale = 'ms';
                        var time = options["time"];
                    } else {
                        var scale = 's';
                        var time = options["time"]+scale;
                    }
            
                    this.el.style[$.feat.cssPrefix+"TransitionDuration"] = time;
                    this.el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = options["timingFunction"];
                    this.el.style[$.feat.cssPrefix+"TransformOrigin"] = options.origin;

                }

                //add callback to the stack
                
                this.callbacksStack.push({
                    complete : options["complete"],
                    success : options["success"],
                    failure : options["failure"]
                });
                this.countStack++;
            
                var that = this;
                var style = window.getComputedStyle(this.el);
                if(classMode){
                    //get the duration
                    var duration = style[$.feat.cssPrefix+"TransitionDuration"];
                    var timeNum = numOnly(duration);
                    if(duration.indexOf("ms")!==-1){
                        var scale = 'ms';
                    } else {
                        var scale = 's';
                    }
                }
                
                //finish asap
                if(timeNum==0 || (scale=='ms' && timeNum<5) || style.display=='none'){
                    //the duration is nearly 0 or the element is not displayed, finish immediatly
                    $.asap($.proxy(this.finishAnimation, this, [false]));
                    //this.finishAnimation();
                    //set transitionend event
                } else {
                    //setup the event normally

                   var that=this;
                    this.activeEvent = function(event){
                        clearTimeout(that.timeout);
                        that.finishAnimation(event);
                        that.el.removeEventListener(transitionEnd, that.activeEvent, false);
                    };         
                    that.timeout=setTimeout(this.activeEvent, numOnly(options["time"]) + 50);         
                    this.el.addEventListener(transitionEnd, this.activeEvent, false);

                }
                
            },
            addCallbackHook:function(callback){
                if(callback) this.callbacksStack.push(callback);
                this.countStack++;
                return this.linkFinishedProxy_;
            },
            linkFinished:function(canceled){
                if(canceled) this.cancel();
                else this.finishAnimation();
            },
            finishAnimation: function (event) {
                if(event) event.preventDefault();
                if(!this.isActive) return;
                
                this.countStack--;
                
                if(this.countStack==0) this.fireCallbacks(false);
            },
            fireCallbacks:function(canceled){
                this.clearEvents();
                
                //keep callbacks after cleanup
                // (if any of the callbacks overrides this object, callbacks will keep on fire as expected)
                var callbacks = this.callbacksStack;
                
                //cleanup
                this.cleanup();
                
                //fire all callbacks
                for(var i=0; i<callbacks.length; i++) {
                    var complete = callbacks[i]['complete'];
                    var success = callbacks[i]['success'];
                    var failure = callbacks[i]['failure'];
                    //fire callbacks
                    if(complete && typeof (complete) == "function") complete(canceled);
                    //success/failure
                    if(canceled && failure && typeof (failure) == "function") failure();
                    else if(success && typeof (success) == "function") success();
                }
            },
            cancel:function(){
                if(!this.isActive) return;
                this.fireCallbacks(true); //fire failure callbacks
            },
            cleanup:function(){
                this.callbacksStack=[];
                this.isActive = false;
                this.countStack = 0;
            },
            clearEvents:function(){
                if(this.activeEvent) {
                    this.el.removeEventListener(transitionEnd, this.activeEvent, false);
                }
                this.activeEvent = null;
            },
            link: function (elID, opts) {
                var callbacks = {complete:opts.complete,success:opts.success,failure:opts.failure};
                opts.complete = this.addCallbackHook(callbacks);
                opts.success = null;
                opts.failure = null;
                //run the animation with the replaced callbacks
                getCSS3Animate(elID, opts);
                //set the old callback back in the obj to avoid strange stuff
                opts.complete = callbacks.complete;
                opts.success = callbacks.success;
                opts.failure = callbacks.failure;
                return this;
            }
        }
        
        return css3Animate;
    })();

    css3Animate.queue = function () {
        return {
            elements: [],
            push: function (el) {
                this.elements.push(el);
            },
            pop: function () {
                return this.elements.pop();
            },
            run: function () {
                var that = this;
                if (this.elements.length == 0) return;
                if (typeof (this.elements[0]) == "function") {
                    var func = this.shift();
                    func();
                }
                if (this.elements.length == 0) return;
                var params = this.shift();
                if (this.elements.length > 0) params.complete = function (canceled) {
                    if(!canceled) that.run();
                };
                css3Animate(document.getElementById(params.id), params);
            },
            shift: function () {
                return this.elements.shift();
            }
        }
    };
})(jq);

/**
 * jq.debug - general and performance debug plugin
 * @copyright 2012 - Carlos Ouro @ Badoo
 * Use like MyClass=$.debug.type(MyClass);
 * Or MyObj=$.debug.object(MyObj);
 */ 
 (function ($) {
	 //you can override this one to have your own 
	 $.debug = {};
	 $.debug.out = function(t){0;};
	 var maxObjectItems = 14;
	 
	 var now=function(){
		 return (new Date()).getTime();
	 }
	 var lastTime=now();
	 var since=function(){
		 thisTime = now();
		 pastTime = thisTime-lastTime;
		 lastTime = thisTime;
		 if(pastTime>10000) {
			 return ""+Math.floor(pastTime/1000)+"s";
		 } else if(pastTime>3000) {
			 return ""+(Math.floor(pastTime/100)/10)+"s";
		 } else {
		 	return ""+Math.floor(pastTime)+"ms";
		 }
	 }
	 var getContent=function(obj, allowRecursive){
		 if(obj===null) return null;
		 
		 curType = typeof obj;
			 
		 if(curType== 'number'){
			 return obj;
		 } else if(curType == 'string'){
		 	return "'"+obj+"'";
		 } else if(curType == 'boolean'){
			 return obj ? "true" : "false";
		 } else if($.isArray(obj)){
			 if(obj.length<=maxObjectItems){
				 var str = "[";
				 var firstItem = true;
			 	for(el in obj){
	   			 	if(!firstItem) str+=', ';
	   			 	else firstItem = false;
					str+=getContent(obj[el], false);
			 	}
				return str+"]";
			 }
		 } else if(curType == 'object'){
			 var isMobi = $.is$(obj);
			 if(!isMobi && allowRecursive && Object.keys(obj).length<=maxObjectItems){
				 var str = "{";
				 var firstItem = true;
			 	for(el in obj){
	   			 	if(!firstItem) str+=', ';
	   			 	else firstItem = false;
					str+=el+":"+getContent(obj[el], false);
			 	}
				return str+"}";
			} else {
				if(isMobi){
					var str = "$("+obj[0].tagName+(obj[0].id?"#"+obj[0].id:"");
					for(var i = 0; i<obj.length; i++){
						str+=", "+oobj[i].tagName+(obj[i].id?"#"+obj[i].id:"");
					}
					return str+")";
				} else if(obj.tagName!==undefined && typeof obj.tagName == 'string'){
					return "["+obj.tagName+(obj.id?"#"+obj.id:"")+"]";
				}
			}
		 }
		 //unrecognized
		 return "["+curType+"]";
	 }
	 var checkParams = function(args){
		 var curType;
		 var str = "";
		 var firstItem = true;
         for (i = 0; i < args.length; i++) {
			 if(!firstItem) str+=', ';
			 else firstItem = false;
			 str+=getContent(args[i], true);
         }
		 if(str=="") str="void";
		 return str;
	 }
	 
	 $.debug.since = function(){
	 	return "[+"+since()+"] ";
	 }
	 
	 $.debug.log = function(t){this.out(this.since()+t);};
	 
	 $.debug.method = function(obj, method, methodName){
		 var that = this;
		 return function(){
			 that.log(methodName+"("+checkParams(arguments)+")");
			 return method.apply(obj, arguments);
		 }
	 }
	 
	 $.debug.object = function(obj, objectName){
		 for (item in obj){
			 if(typeof obj[item] == 'function'){
			 	obj[item] = this.method(obj, obj[item], objectName+"."+item);
			 }
		 }
	 }
	 
	 $.debug.type = function(c, objectName){
		 var that = this;
		 var a = function(){
			 that.log(objectName+".constructor("+checkParams(arguments)+")");
			 c.apply(this, arguments);
			 that.object(this, objectName);
		 }
		 for(el in c.prototype){
		 	a.prototype[el]=c.prototype[el];
		 }
		 return a;
	 }
	 
	 
})(jq);



// //UNIT TESTING
// 
// //VARIABLES
// var t = {
// 	a:16,
// 	b:11,
// 	f: function(){
// 		return this.f2();
// 	},
// 	f2: function(){
// 		return this.a+this.b;
// 	}
// }
// 
// var t2 = {
// 	a:15,
// 	b:10,
// 	f: function(){
// 		return this.f2();
// 	},
// 	f2: function(){
// 		return this.a+this.b;
// 	}
// }
// 
// 
// 
// var t3 = function(){this.b = 20;this.c = 5;}
// t3.prototype = {
// 	a: 20,
// 	b: 1000,
// 	f: function(){
// 		return this.f2();
// 	}
// }
// t3.prototype.f2=function(){
// 	return this.a+this.b+this.b;
// }
// 
// //SETUP
// t.f = $.debug.method(t, t.f, 't.f');
// t.f2 = $.debug.method(t, t.f2, 't.f2');
// $.debug.object(t2, 't2');
// t3 = $.debug.type(t3, 't3');
// 
// 
// //RUN TESTS
// console.log(t.f());
// console.log(t2.f());
// var t3Test = new t3();
// console.log(t3Test.f());
// //plus details should appear on console

//desktopBrowsers contributed by Carlos Ouro @ Badoo
//translates desktop browsers events to touch events and prevents defaults
//It can be used independently in other apps but it is required for using the touchLayer in the desktop


;(function ($) {
	var cancelClickMove=false;
	var preventAll = function(e) 
    {
        e.preventDefault();
		e.stopPropagation();
    }
	
	var redirectMouseToTouch = function(type, originalEvent, newTarget) 
	{

		var theTarget = newTarget ? newTarget : originalEvent.target;
		
	    //stop propagation, and remove default behavior for everything but INPUT, TEXTAREA & SELECT fields
	    if (theTarget.tagName.toUpperCase().indexOf("SELECT") == -1 && 
	    theTarget.tagName.toUpperCase().indexOf("TEXTAREA") == -1 && 
	    theTarget.tagName.toUpperCase().indexOf("INPUT") == -1)  //SELECT, TEXTAREA & INPUT
	    {
	        preventAll(originalEvent);
	    }
    
	    var touchevt = document.createEvent("MouseEvent");

	    touchevt.initEvent(type, true, true);
	    touchevt.initMouseEvent(type, true, true, window, originalEvent.detail, originalEvent.screenX, originalEvent.screenY, originalEvent.clientX, originalEvent.clientY, originalEvent.ctrlKey, originalEvent.shiftKey, originalEvent.altKey, originalEvent.metaKey, originalEvent.button, originalEvent.relatedTarget);    
		if(type!='touchend'){
		    touchevt.touches = new Array();
		    touchevt.touches[0] = new Object();
		    touchevt.touches[0].pageX = originalEvent.pageX;
		    touchevt.touches[0].pageY = originalEvent.pageY;
			//target
		    touchevt.touches[0].target = theTarget;
		    touchevt.changedTouches = touchevt.touches; //for jqtouch
		    touchevt.targetTouches = touchevt.touches;  //for jqtouch
		}
		//target
		
		touchevt.mouseToTouch = true;
		if($.os.ie) {
		//handle inline event handlers for target and parents (for bubbling)
			var elem = originalEvent.target;
			while(elem!=null) {
				if(elem.hasAttribute("on"+type)) {
					eval(elem.getAttribute("on"+type));
				}
				elem = elem.parentElement;
			}
		}
	    theTarget.dispatchEvent(touchevt);
	}
	
    var mouseDown = false,
		lastTarget = null,firstMove=false;

	if(!window.navigator.msPointerEnabled){

	    document.addEventListener("mousedown", function(e) 
	    {
			mouseDown = true;
			lastTarget = e.target;
			if(e.target.nodeName.toLowerCase()=="a"&&e.target.href.toLowerCase()=="javascript:;")
				e.target.href="#";
	        redirectMouseToTouch("touchstart", e);
	        firstMove = true;
	        cancelClickMove=false;
	    }, true);

	    document.addEventListener("mouseup", function(e) 
	    {
			if(!mouseDown) return;
	        redirectMouseToTouch("touchend", e, lastTarget);	//bind it to initial mousedown target
			lastTarget = null;
			mouseDown = false;
	    }, true);

	    document.addEventListener("mousemove", function(e) 
	    {
	        if (!mouseDown) return;
	        if(firstMove) return firstMove=false
	        redirectMouseToTouch("touchmove", e);
	    	e.preventDefault();

	    	cancelClickMove=true;
	    }, true);
	}
	else { //Win8
	    document.addEventListener("MSPointerDown", function(e) 
	    {

			mouseDown = true;
			lastTarget = e.target;
			if(e.target.nodeName.toLowerCase()=="a"&&e.target.href.toLowerCase()=="javascript:;")
				e.target.href="#";
	        redirectMouseToTouch("touchstart", e);
	        firstMove = true;
	        cancelClickMove=false;
	      //  e.preventDefault();e.stopPropagation();
	    }, true);

	    document.addEventListener("MSPointerUp", function(e) 
	    {
			if(!mouseDown) return;
	        redirectMouseToTouch("touchend", e, lastTarget);	//bind it to initial mousedown target
			lastTarget = null;
			mouseDown = false;
		//	e.preventDefault();e.stopPropagation();
	    }, true);

	    document.addEventListener("MSPointerMove", function(e) 
	    {

	        if (!mouseDown) return;
	        if(firstMove) return firstMove=false
	        redirectMouseToTouch("touchmove", e);
	    	e.preventDefault();
	    	//e.stopPropagation();

	    	cancelClickMove=true;

	    }, true);
	}	
		
		
	//prevent all mouse events which dont exist on touch devices
    document.addEventListener("drag", preventAll, true);
	document.addEventListener("dragstart", preventAll, true);
	document.addEventListener("dragenter", preventAll, true);
	document.addEventListener("dragover", preventAll, true);
	document.addEventListener("dragleave", preventAll, true);
	document.addEventListener("dragend", preventAll, true);
	document.addEventListener("drop", preventAll, true);
	document.addEventListener("selectstart", preventAll, true);
	document.addEventListener("click", function(e) 
    {
		if(!e.mouseToTouch&&e.target==lastTarget){
	        preventAll(e);
		}
		if(cancelClickMove)
		{
			preventAll(e);
			cancelClickMove=false;
		}
    }, true);
	
	
	window.addEventListener("resize",function(){
		var touchevt = document.createEvent("Event");
	 	touchevt.initEvent("orientationchange", true, true);
	    document.dispatchEvent(touchevt);
	},false);
	
})(jq);

/**
 * jq.web.drawer - a drawer for html5 mobile apps
 * Copyright 2011 - Intel 
 */ (function ($) {
    $.fn["drawer"] = function (opts) {
        var tmp;
        for (var i = 0; i < this.length; i++) {
            tmp = new drawer(this[i], opts);
        }
        return this.length == 1 ? tmp : this;
    };
    var drawer = (function () {
        
        var translateOpen =$.feat.cssTransformStart;
        var translateClose = $.feat.cssTransformEnd;
        var touchStarted = false;

        var drawer = function (elID, opts) {
                if (typeof elID == "string" || elID instanceof String) {
                    this.el = document.getElementById(elID);
                } else {
                    this.el = elID;
                }
                if (!this.el) {
                    alert("Could not find element for drawer " + elID);
                    return;
                }

                if (this instanceof drawer) {
                    for (j in opts) {
                        this[j] = opts[j];
                    }
                } else {
                    return new drawer(elID, opts);
                }
                this.direction=this.direction.toLowerCase();
                try {
                    this.handle = this.el.querySelectorAll(".drawer_handle")[0];
                    if (!this.handle) return alert("Could not find handle for drawer -  " + elID);
                    var that = this;
                    this.handle.addEventListener('touchmove', function (e) {
                        that.touchMove(e);
                    }, false);
                    this.handle.addEventListener('touchend', function (e) {
                        that.touchEnd(e);
                    }, false);

                } catch (e) {
                    alert("error adding drawer" + e);
                }
                this.zIndex=$(this.el).css("zIndex");
            };

        drawer.prototype = {
            lockY: 0,
            lockX:0,
            boolScrollLock: false,
            currentDrawer: null,
            maxTop: 0,
            startTop: 0,
            maxLeft:0,
            startLeft:0,
            timeMoved: 0,
            vdistanceMoved: 0,
            hdistanceMoved:0,
            direction: "down",
            prevTime: 0,
            handle: null,
            zIndex:1,
            // horizontal scrolling
            // handle the moving function
            touchMove: function (event) {
                try {
                    if (!touchStarted) {
                        touchStarted = true;
                        this.touchStart(event);
                    }
                    if (this.currentDrawer != null) {
                        event.preventDefault();
                        var drawerPoints = {
                            x: 0,
                            y: 0
                        };
                        if(this.direction=="down"||this.direction=="up"){
                            var newTop = 0,
                                prevTop = 0;
                            var deltaY = this.lockY - event.touches[0].pageY;
                            deltaY = -deltaY;
                            var newTop = this.startTop + deltaY;
                            var top = -newTop;
                            try {
                                var prevTop = numOnly($.getCssMatrix(this.el).f);
                            } catch (prevTopE) {
                                var prevTop = 0;
                            }
                            drawerPoints.y = newTop;
                            this.vdistanceMoved += Math.abs(prevTop) - Math.abs(newTop);
                        }
                        else {
                            var newLeft = 0,
                                prevLeft = 0;
                            var deltaX = this.lockX - event.touches[0].pageX;
                            deltaX = -deltaX;
                            var newLeft = this.startLeft + deltaX;
                            var left = -newLeft;
                            try {
                                var prevLeft = numOnly($.getCssMatrix(this.el).e);
                            } catch (prevTopE) {
                                var prevLeft = 0;
                            }
                            drawerPoints.x = newLeft;
                            this.hdistanceMoved += Math.abs(prevLeft) - Math.abs(newLeft);
                        }
                        this.drawerMove(this.currentDrawer, drawerPoints, 0);
                    }
                } catch (e) {
                    alert("error in scrollMove: " + e);
                }
            },

            touchStart: function (event) {

                var handle = this.handle;
                var eleScrolling = this.el;
                if (!handle) return;

                try {
                    // Allow interaction to legit calls, like select boxes, etc.
                    if (event.touches[0].target && event.touches[0].target.type != undefined) {
                        var tagname = event.touches[0].target.tagName.toLowerCase();
                        if (tagname == "select" || tagname == "input" || tagname == "button") // stuff we need to allow
                        // access to
                        return;
                    }
                    this.vdistanceMoved = 0;
                    this.hdistanceMoved = 0;

                    this.maxTop = numOnly(this.el.style.height) - numOnly(this.handle.style.height);
                    this.maxLeft = numOnly(this.el.style.width) - numOnly(this.handle.style.width);
                    
                    if (this.direction == "up") this.maxTop *= -1;
                    if (this.direction=="left") this.maxLeft*=-1;
                    if (event.touches.length == 1 && this.boolScrollLock == false) {
                        try {
                            this.startTop = numOnly($.getCssMatrix(this.el).f);
                            this.startLeft = numOnly($.getCssMatrix(this.el).e);
                        } catch (e) {
                            this.startTop = 0;
                            this.startLeft=0;
                            0;
                        }
                        this.lockY = event.touches[0].pageY;
                        this.lockX=event.touches[0].pageX;
                        this.currentDrawer = eleScrolling;
                        event.preventDefault();
                    }
                } catch (e) {
                    alert("error in drawer start: " + e);
                }
            },

            // touchend callback. Set the current scrolling object and scrollbar to
            // null
            touchEnd: function (event) {
                if (this.currentDrawer != null) {
                    event.preventDefault();
                    event.stopPropagation();

                    var drawerPoints = {
                        x: 0,
                        y: 0
                    };
                    if(this.direction=="up"||this.direction=="down"){
                        var myDistance = -this.vdistanceMoved;
                        var percentMoved = Math.ceil(Math.abs(myDistance) / Math.abs(this.maxTop) * 100);
                        var prevTop = numOnly($.getCssMatrix(this.el).f);
                        if (percentMoved > 17) {

                            if (myDistance > 0) drawerPoints.y = this.maxTop;
                            else drawerPoints.y = 0;
                        } else {
                            if (Math.floor(this.maxTop / prevTop) > 2) drawerPoints.y = 0;
                            else drawerPoints.y = this.maxTop;
                        }
                        
                    }
                    else {
                        var myDistance = -this.hdistanceMoved;
                        var percentMoved = Math.ceil(Math.abs(myDistance) / Math.abs(this.maxLeft) * 100);
                        var prevLeft = numOnly($.getCssMatrix(this.el).e);
                        if (percentMoved > 17) {

                            if (myDistance > 0) drawerPoints.x = this.maxLeft;
                            else drawerPoints.x = 0;
                        } else {
                            if (Math.floor(this.maxLeft / prevLeft) > 2) drawerPoints.y = 0;
                            else drawerPoints.x = this.maxLeft;
                        }                        
                    }
                    if(drawerPoints.y>0||drawerPoints.x>0)
                       this.el.zIndex="9999";
                    else
                       this.el.zIndex=this.zIndex;

                    this.drawerMove(this.currentDrawer, drawerPoints, 300, "ease-out");
                    this.currentDrawer = null;
                }
                this.vdistanceMoved = 0;
                touchStarted = false;
            },

            drawerMove: function (el, distanceToMove, time, timingFunction) {
                if (!time) time = 0;
                if (!timingFunction) timingFunction = "linear";

                el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
                el.style[$.feat.cssPrefix+"TransitionDuration"] = time + "ms";
                el.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
                el.style[$.feat.cssPrefix+"TransformStyle"] = "preserve-3d";
                el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
            }
        };
        return drawer;
    })();
})(jq);
/**
 * jq.fx.js
 * FX library for jqMobi
 *
 */ 
 (function ($) {
    var noop = function () {};
    /**
     * Fade out an element by setting the opacity to 0 and hiding it when it's finished
       ```
       $('.tool_tip').fadeOut('300ms');
       ```
     *
     * @param {String} animation time
     * @param {Function} [callback]
     * @title $().fadeOut(time,callback);
     */
    $.fn.fadeOut = function (time, cb, opc) {
        if (this.length == 0) return;
        if (!time) time = 0;
        var that = this;
        var callbackFn = noop;
        if (!cb) cb = noop;
        if (!opc) {
            opc = 0;
            callbackFn = function () {
                this.hide();
            }
        }
        var opts = {
            opacity: opc,
            time: time,
            callback: function () {
                cb.apply(that);
                callbackFn.apply(that);
            }
        }
        this.css3Animate(opts);
        return this;
    };
    /**
     * Fade in an element by setting the opacity to 1.  We will set the display property so it's shown
       ```
       $('.tool_tip').fadeIn('300ms');
       ```
     *
     * @param {String} animation time
     * @param {Function} [callback]
     * @title $().fadeIn(time,callback);
     */
    $.fn.fadeIn = function (time, callback) {

        if (!time) time = "300ms";
        this.show();
        this.css("opacity", '.1');
        var that = this;
        window.setTimeout(function () {
            that.fadeOut(time, callback, 10);
        }, 1);
        return this;
    };
    /**
     * Toggle slide in/out a element based off time.  We handle hiding/showing and keeping the previous height
       ```
       $('.tool_tip').slideToggle('300ms');
       ```
     *
     * @param {String} animation time
     * @param {Function} [callback]
     * @param {String} css3 easing method
     * @title $().slideToggle(time,callback,easing);
     */
    $.fn.slideToggle = function (duration, callback, easing) {
        var opts = {
            time: duration ? duration : "500ms",
            callback: callback ? callback : null,
            easing: easing ? easing : "linear"
        }
        for (var i = 0; i < this.length; i++) {
            var hideshow = this.css("display", null, this[i]);
            var expand = false;
            var elem = $(this[i]);
            if (hideshow == "none") {
                elem.show();
                expand = true;
            }
            var height = this.css("height", null, this[i]);
            if (expand) {
                elem.css("height", "0px");
                opts['height'] = height;
            } else {
                opts['height'] = "0px";
                var oldCB = callback;
                callback = function () {
                    elem.hide();
                    var cbOpts = {
                        height: height,
                        time: "0ms"
                    }
                    elem.css3Animate(cbOpts);
                }
            }
            if (callback) opts['callback'] = callback;
            window.setTimeout(function () {
                elem.css3Animate(opts);
            }, 1);
        }
        return this;
    }
})(jq);
/*
 * jq.web.passwordBox - password box replacement for html5 mobile apps on android due to a bug with CSS3 translate3d
 * @copyright 2011 - Intel
 */
(function ($) {
    $["passwordBox"] = function () {

        return new passwordBox();
    };

    var passwordBox = function () {
            this.oldPasswords = {};
        };
    passwordBox.prototype = {
        showPasswordPlainText: false,
        getOldPasswords: function (elID) {
         //   if ($.os.android == false) return; -  iOS users seem to want this too, so we'll let everyone join the party
            var container = elID && document.getElementById(elID) ? document.getElementById(elID) : document;
            if (!container) {
                alert("Could not find container element for passwordBox " + elID);
                return;
            }
            var sels = container.getElementsByTagName("input");

            var that = this;
            for (var i = 0; i < sels.length; i++) {
                if (sels[i].type != "password") continue;

                if($.os.webkit){
                    sels[i].type = "text";
                    sels[i].style['-webkit-text-security'] = "disc";
                }
            }
        },

        changePasswordVisiblity: function (what, id) {
            what = parseInt(what);
            var theEl = document.getElementById(id);
            
            if (what == 1) { //show
                theEl.style[$.cssPrefix+'text-security'] = "none";
            } else {
                theEl.style[$.cssPrefix+'text-security'] = "disc";
            }
            if(!$.os.webkit) {
                if(what==1)
                    theEl.type="text"
                else
                    theEl.type="password";
            }
            theEl = null;
        }
    };
})(jq);
/**
 * jq.popup - a popup/alert library for html5 mobile apps
 * @copyright Indiepath 2011 - Tim Fisher
 * Modifications/enhancements by appMobi for jqMobi
 * 
 */

/* EXAMPLE
  $('body').popup({
	    title:"Alert! Alert!",
	    message:"This is a test of the emergency alert system!! Don't PANIC!",
	    cancelText:"Cancel me", 
	    cancelCallback: function(){console.log("cancelled");},
	    doneText:"I'm done!",
	    doneCallback: function(){console.log("Done for!");},
	    cancelOnly:false,
        doneClass:'button',
        cancelClass:'button',
        onShow:function(){console.log('showing popup');}
        autoCloseDone:true, //default is true will close the popup when done is clicked.
        suppressTitle:false //Do not show the title if set to true
  });
  
  You can programatically trigger a close by dispatching a "close" event to it.
  
  $('body').popup({title:'Alert',id:'myTestPopup'});
  $("#myTestPopup").trigger("close");
  
 */
(function($) {
    
    $.fn.popup = function(opts) {
        return new popup(this[0], opts);
    };
    var queue = [];
    var popup = (function() {
        var popup = function(containerEl, opts) {
            
            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                alert("Error finding container for popup " + containerEl);
                return;
            }
            
            try {
                if (typeof (opts) === "string" || typeof (opts) === "number")
                    opts = {message: opts,cancelOnly: "true",cancelText: "OK"};
                this.id = id = opts.id = opts.id || $.uuid(); //opts is passed by reference
                var self = this;
                this.title = opts.suppressTitle?"":(opts.title || "Alert");
                this.message = opts.message || "";
                this.cancelText = opts.cancelText || "Cancel";
                this.cancelCallback = opts.cancelCallback || function() {
                };
                this.cancelClass = opts.cancelClass || "button";
                this.doneText = opts.doneText || "Done";
                this.doneCallback = opts.doneCallback || function(self) {
                    // no action by default
                };
                this.doneClass = opts.doneClass || "button";
                this.cancelOnly = opts.cancelOnly || false;
                this.onShow = opts.onShow || function(){};
                this.autoCloseDone=opts.autoCloseDone!==undefined?opts.autoCloseDone:true;
                
                queue.push(this);
                if (queue.length == 1)
                    this.show();
            } catch (e) {
                0;
            }
        
        };
        
        popup.prototype = {
            id: null,
            title: null,
            message: null,
            cancelText: null,
            cancelCallback: null,
            cancelClass: null,
            doneText: null,
            doneCallback: null,
            doneClass: null,
            cancelOnly: false,
            onShow: null,
            autoCloseDone:true,
            supressTitle:false,
            show: function() {
                var self = this;
                var markup = '<div id="' + this.id + '" class="jqPopup hidden">\
	        				<header>' + this.title + '</header>\
	        				<div><div style="width:1px;height:1px;-webkit-transform:translate3d(0,0,0);float:right"></div>' + this.message + '</div>\
	        				<footer style="clear:both;">\
	        					<a href="javascript:;" class="'+this.cancelClass+'" id="cancel">' + this.cancelText + '</a>\
	        					<a href="javascript:;" class="'+this.doneClass+'" id="action">' + this.doneText + '</a>\
	        				</footer>\
	        			</div></div>';
                $(this.container).append($(markup));
                
                var $el=$("#"+this.id);
                $el.bind("close", function(){
                	self.hide();
                })
                
                if (this.cancelOnly) {
                    $el.find('A#action').hide();
                    $el.find('A#cancel').addClass('center');
                }
                $el.find('A').each(function() {
                    var button = $(this);
                    button.bind('click', function(e) {
                        if (button.attr('id') == 'cancel') {
                            self.cancelCallback.call(self.cancelCallback, self);
                            self.hide();
                        } else {
                            self.doneCallback.call(self.doneCallback, self);
                            if(self.autoCloseDone)
                                self.hide();
                        }
                        e.preventDefault();
                     });
                });
                self.positionPopup();
                $.block_ui(0.5);
                $el.removeClass('hidden');
                $el.bind("orientationchange", function() {
                    self.positionPopup();
                });
               
                //force header/footer showing to fix CSS style bugs
                $el.find("header").show();
                $el.find("footer").show();
                this.onShow(this);
                
            },
            
            hide: function() {
                var self = this;
                $('#' + self.id).addClass('hidden');
                $.unblock_ui();
                setTimeout(function() {
                    self.remove();
                }, 250);
            },
            
            remove: function() {
                var self = this;
                var $el=$("#"+self.id);
                $el.unbind("close");
                $el.find('BUTTON#action').unbind('click');
                $el.find('BUTTON#cancel').unbind('click');
                $el.unbind("orientationchange").remove();
                queue.splice(0, 1);
                if (queue.length > 0)
                    queue[0].show();
            },
            
            positionPopup: function() {
                var popup = $('#' + this.id);
                popup.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popup[0].clientHeight / 2) + "px");
                popup.css("left", (window.innerWidth / 2) - (popup[0].clientWidth / 2) + "px");
            }
        };
        
        return popup;
    })();
    var uiBlocked = false;
    $.block_ui = function(opacity) {
        if (uiBlocked)
            return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $('BODY').prepend($("<div id='mask'" + opacity + "></div>"));
        $('BODY DIV#mask').bind("touchstart", function(e) {
            e.preventDefault();
        });
        $('BODY DIV#mask').bind("touchmove", function(e) {
            e.preventDefault();
        });
        uiBlocked = true
    };
    
    $.unblock_ui = function() {
        uiBlocked = false;
        $('BODY DIV#mask').unbind("touchstart");
        $('BODY DIV#mask').unbind("touchmove");
        $("BODY DIV#mask").remove();
    };
    /**
     * Here we override the window.alert function due to iOS eating touch events on native alerts
     */
    window.alert = function(text) {
        if(text===null||text===undefined)
            text="null";
        if($("#ui_kit").length>0)
            $("#ui_kit").popup(text.toString());
        else
            $(document.body).popup(text.toString());
    }
    
})(jq);
/**
 * jq.scroller - rewritten by Carlos Ouro @ Badoo
 * Supports iOS native touch scrolling and a much improved javascript scroller
 */
(function($) {
	var HIDE_REFRESH_TIME = 75; // hide animation of pull2ref duration in ms
	var cache = [];
	var objId = function(obj) {
			if(!obj.jqmScrollerId) obj.jqmScrollerId = $.uuid();
			return obj.jqmScrollerId;
		}
	$.fn["scroller"] = function(opts) {
		var tmp, id;
		for(var i = 0; i < this.length; i++) {
			//cache system
			id = objId(this[i]);
			if(!cache[id]) {
				if(!opts) opts = {};
				if(!$.feat.nativeTouchScroll) opts.useJsScroll = true;

				tmp = scroller(this[i], opts);
				cache[id] = tmp;
			} else {
				tmp = cache[id];
			}
		}
		return this.length == 1 ? tmp : this;
	};
	var boundTouchLayer = false;

	function checkConsistency(id) {
		if(!cache[id].el) {
			delete cache[id];
			return false;
		}
		return true;
	}

	function bindTouchLayer() {
		//use a single bind for all scrollers
		if(jq.os.android && !jq.os.chrome&&jq.os.webkit) {
			var androidFixOn = false;
			//connect to touchLayer to detect editMode
			$.bind($.touchLayer, 'pre-enter-edit', function(focusEl) {
				if(!androidFixOn) {
					androidFixOn = true;
					//activate on scroller
					for(el in cache)
					if(checkConsistency(el) && cache[el].needsFormsFix(focusEl)) cache[el].startFormsMode();
				}
			});
			$.bind($.touchLayer, ['cancel-enter-edit', 'exit-edit'], function(focusEl) {
				if(androidFixOn) {
					androidFixOn = false;
					//dehactivate on scroller
					for(el in cache)
					if(checkConsistency(el) && cache[el].androidFormsMode) cache[el].stopFormsMode();
				}
			});
		}
		boundTouchLayer = true;
	}
	var scroller = (function() {
        var translateOpen =$.feat.cssTransformStart;
        var translateClose = $.feat.cssTransformEnd;
		var jsScroller, nativeScroller;

		//initialize and js/native mode selector
		var scroller = function(elID, opts) {


				if(!boundTouchLayer && $.touchLayer && $.isObject($.touchLayer)) bindTouchLayer()
				else if(!($.touchLayer && $.isObject($.touchLayer))) $.touchLayer = {};

				if(typeof elID == "string" || elID instanceof String) {
					var el = document.getElementById(elID);
				} else {
					var el = elID;
				}
				if(!el) {
					alert("Could not find element for scroller " + elID);
					return;
				}
				if(jq.os.desktop)
					return new scrollerCore(el,opts);
				else if(opts.useJsScroll) return new jsScroller(el, opts);
				return new nativeScroller(el, opts);

			};

		//parent abstract class (common functionality)
		var scrollerCore = function(el,opts) {
			this.el=el;
			this.jqEl = $(this.el);
			for(j in opts) {
				this[j] = opts[j];
			}
		};
		scrollerCore.prototype = {
			//core default properties
			refresh: false,
			refreshContent: "Pull to Refresh",
			refreshHangTimeout: 2000,
			refreshHeight: 60,
			refreshElement: null,
			refreshCancelCB: null,
			refreshRunning: false,
			scrollTop: 0,
			scrollLeft: 0,
			preventHideRefresh: true,
			verticalScroll: true,
			horizontalScroll: false,
			refreshTriggered: false,
			moved: false,
			eventsActive: false,
			rememberEventsActive: false,
			scrollingLocked: false,
			autoEnable: true,
			blockFormsFix: false,
			loggedPcentY: 0,
			loggedPcentX: 0,
			infinite: false,
			infiniteEndCheck: false,
			infiniteTriggered: false,
			scrollSkip: false,
			scrollTopInterval:null,
			scrollLeftInterval:null,
			_scrollTo:function(params,time){
				var time=parseInt(time);
                if(time==0||isNaN(time))
                {
				this.el.scrollTop=Math.abs(params.y);
				this.el.scrollLeft=Math.abs(params.x);
					return;
				}
                var singleTick=10;
               	var distPerTick=(this.el.scrollTop-params.y)/Math.ceil(time/singleTick);
               	var distLPerTick=(this.el.scrollLeft-params.x)/Math.ceil(time/singleTick);
                var self=this;
                var toRunY=Math.ceil(this.el.scrollTop-params.y)/distPerTick;
                var toRunX=Math.ceil(this.el.scrollLeft-params.x)/distPerTick;
                var xRun=yRun=0;
               	self.scrollTopInterval=window.setInterval(function(){
                    self.el.scrollTop-=distPerTick;
                    yRun++;
                	if(yRun>=toRunY){
                		self.el.scrollTop=params.y;
                		clearInterval(self.scrollTopInterval);
                	}
                },singleTick);

                self.scrollLeftInterval=window.setInterval(function(){
                    self.el.scrollLeft-=distLPerTick;
                    xRun++;
                    if(xRun>=toRunX){
                		self.el.scrollLeft=params.x;
                		clearInterval(self.scrollLeftInterval);
                	}
                },singleTick);
			},
            enable:function(){},
            disable:function(){},
            hideScrollbars:function(){},
            addPullToRefresh:function(){},
            /**
              * We do step animations for 'native' - iOS is acceptable and desktop browsers are fine
              * instead of css3
              */
            _scrollToTop:function(time){
                this._scrollTo({x:0,y:0},time);
            },
            _scrollToBottom:function(time){
            	this._scrollTo({x:0,y:this.el.scrollHeight-this.el.offsetHeight},time);
            },
            scrollToBottom:function(time){
            	return this._scrollToBottom(time);
            },
            scrollToTop:function(time){
            	return this._scrollToTop(time);
            },

			//methods
			init: function(el, opts) {
				this.el = el;
				this.jqEl = $(this.el);
				this.defaultProperties();
				for(j in opts) {
					this[j] = opts[j];
				}
				//assign self destruct
				var that = this;
				var orientationChangeProxy = function() {
						//no need to readjust if disabled...
						if(that.eventsActive) that.adjustScroll();
					}
				this.jqEl.bind('destroy', function() {
					that.disable(true); //with destroy notice
					var id = that.el.jqmScrollerId;
					if(cache[id]) delete cache[id];
					$.unbind($.touchLayer, 'orientationchange-reshape', orientationChangeProxy);
				});
				$.bind($.touchLayer, 'orientationchange-reshape', orientationChangeProxy);
			},
			needsFormsFix: function(focusEl) {
				return this.useJsScroll && this.isEnabled() && this.el.style.display != "none" && $(focusEl).closest(this.jqEl).size() > 0;
			},
			handleEvent: function(e) {
				if(!this.scrollingLocked) {
					switch(e.type) {
					case 'touchstart':
                        clearInterval(this.scrollTopInterval);
						this.preventHideRefresh = !this.refreshRunning; // if it's not running why prevent it xD
						this.moved = false;
						this.onTouchStart(e);
						break;
					case 'touchmove':
						this.onTouchMove(e);
						break;
					case 'touchend':
						this.onTouchEnd(e);
						break;
					case 'scroll':
						this.onScroll(e);
						break;
					}
				}
			},
			coreAddPullToRefresh: function(rEl) {
				if(rEl) this.refreshElement = rEl;
				//Add the pull to refresh text.  Not optimal but keeps from others overwriting the content and worrying about italics
				//add the refresh div
				if(this.refreshElement == null) {
					var orginalEl = document.getElementById(this.container.id + "_pulldown");
					if(orginalEl != null) {
						var jqEl = jq(orginalEl);
					} else {
						var jqEl = jq("<div id='" + this.container.id + "_pulldown' class='jqscroll_refresh' style='border-radius:.6em;border: 1px solid #2A2A2A;background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#666666),color-stop(1,#222222));background:#222222;margin:0px;height:60px;position:relative;text-align:center;line-height:60px;color:white;width:100%;'>" + this.refreshContent + "</div>");
					}
				} else {
					var jqEl = jq(this.refreshElement);
				}
				var el = jqEl.get();

				this.refreshContainer = jq("<div style=\"overflow:hidden;width:100%;height:0;margin:0;padding:0;padding-left:5px;padding-right:5px;display:none;\"></div>");
				$(this.el).prepend(this.refreshContainer.append(el, 'top'));
				this.refreshContainer = this.refreshContainer[0];
			},
			fireRefreshRelease: function(triggered, allowHide) {
				if(!this.refresh || !triggered) return;

				var autoCancel = $.trigger(this, 'refresh-release', [triggered]) !== false;
				this.preventHideRefresh = false;
				this.refreshRunning = true;
				if(autoCancel) {
					var that = this;
					if(this.refreshHangTimeout > 0) this.refreshCancelCB = setTimeout(function() {
						that.hideRefresh()
					}, this.refreshHangTimeout);
				}
			},
			setRefreshContent: function(content) {
				jq(this.container).find(".jqscroll_refresh").html(content);
			},
			lock: function() {
				if(this.scrollingLocked) return;
				this.scrollingLocked = true;
				this.rememberEventsActive = this.eventsActive;
				if(!this.eventsActive) {
					this.initEvents();
				}
			},
			unlock: function() {
				if(!this.scrollingLocked) return;
				this.scrollingLocked = false;
				if(!this.rememberEventsActive) {
					this.removeEvents();
				}
			},
			scrollToItem: function(el, where) { //TODO: add functionality for x position
				if(!$.is$(el)) el = $(el);

				if(where == 'bottom') {
					var itemPos = el.offset();
					var newTop = itemPos.top - this.jqEl.offset().bottom + itemPos.height;
					newTop += 4; //add a small space
				} else {
					var itemTop = el.offset().top;
					var newTop = itemTop - document.body.scrollTop;
					var panelTop = this.jqEl.offset().top;
					if(document.body.scrollTop < panelTop) {
						newTop -= panelTop;
					}
					newTop -= 4; //add a small space
				}

				this.scrollBy({
					y: newTop,
					x: 0
				}, 0);
			},
			setPaddings: function(top, bottom) {
				var el = $(this.el);
				var curTop = numOnly(el.css('paddingTop'));
				el.css('paddingTop', top + "px").css('paddingBottom', bottom + "px");
				//don't let padding mess with scroll
				this.scrollBy({
					y: top - curTop,
					x: 0
				});
			},
			//freak of mathematics, but for our cases it works
			divide: function(a, b) {
				return b != 0 ? a / b : 0;
			},
			isEnabled: function() {
				return this.eventsActive;
			},
			addInfinite: function() {
				this.infinite = true;
			},
			clearInfinite: function() {
				this.infiniteTriggered = false;
				this.scrollSkip = true;
			}
		}

		//extend to jsScroller and nativeScroller (constructs)
		jsScroller = function(el, opts) {
			this.init(el, opts);
			//test
			//this.refresh=true;
			this.container = this.el.parentNode;
			this.container.jqmScrollerId = el.jqmScrollerId;
			this.jqEl = $(this.container);

			if(this.container.style.overflow != 'hidden') this.container.style.overflow = 'hidden';

			this.addPullToRefresh(null, true);
			if(this.autoEnable) this.enable(true);

			//create vertical scroll
			if(this.verticalScroll && this.verticalScroll == true && this.scrollBars == true) {
				var scrollDiv = createScrollBar(5, 20);
				scrollDiv.style.top = "0px";
				if(this.vScrollCSS) scrollDiv.className = this.vScrollCSS;
				scrollDiv.style.opacity = "0";
				this.container.appendChild(scrollDiv);
				this.vscrollBar = scrollDiv;
				scrollDiv = null;
			}
			//create horizontal scroll
			if(this.horizontalScroll && this.horizontalScroll == true && this.scrollBars == true) {
				var scrollDiv = createScrollBar(20, 5);
				scrollDiv.style.bottom = "0px";


				if(this.hScrollCSS) scrollDiv.className = this.hScrollCSS;
				scrollDiv.style.opacity = "0";
				this.container.appendChild(scrollDiv);
				this.hscrollBar = scrollDiv;
				scrollDiv = null;
			}
			if(this.horizontalScroll) this.el.style['float'] = "left";

			this.el.hasScroller = true;

		};
		nativeScroller = function(el, opts) {

			this.init(el, opts);
			var $el = $(el);
			if(opts.noParent !== true) {
				var oldParent = $el.parent();
				var oldHeight=oldParent.height();
				oldHeight+=oldHeight.indexOf("%")==-1?"px":"";
				$el.css('height', oldHeight);
				$el.parent().parent().append($el);
				oldParent.remove();
			}
			this.container = this.el;
			$el.css("-webkit-overflow-scrolling", "touch");
		}
		nativeScroller.prototype = new scrollerCore();
		jsScroller.prototype = new scrollerCore();




		///Native scroller
		nativeScroller.prototype.defaultProperties = function() {

			this.refreshContainer = null;
			this.dY = this.cY = 0;
			this.cancelPropagation = false;
			this.loggedPcentY = 0;
			this.loggedPcentX = 0;
			var that = this;
			this.adjustScrollOverflowProxy_ = function() {
				that.jqEl.css('overflow', 'auto');
			}
		}
		nativeScroller.prototype.enable = function(firstExecution) {
			if(this.eventsActive) return;
			this.eventsActive = true;
			//unlock overflow
			this.el.style.overflow = 'auto';
			//set current scroll

			
			if(!firstExecution) this.adjustScroll();
			//set events
			if(this.refresh || this.infinite&&!jq.os.desktop) this.el.addEventListener('touchstart', this, false);
			this.el.addEventListener('scroll', this, false)
		}
		nativeScroller.prototype.disable = function(destroy) {
			if(!this.eventsActive) return;
			//log current scroll
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
			//lock overflow
			if(!destroy) this.el.style.overflow = 'hidden';
			//remove events
			this.el.removeEventListener('touchstart', this, false);
			this.el.removeEventListener('touchmove', this, false);
			this.el.removeEventListener('touchend', this, false);
			this.el.removeEventListener('scroll', this, false);
			this.eventsActive = false;
		}
		nativeScroller.prototype.addPullToRefresh = function(el, leaveRefresh) {
			this.el.removeEventListener('touchstart', this, false);
			this.el.addEventListener('touchstart', this, false);
			if(!leaveRefresh) this.refresh = true;
			if(this.refresh && this.refresh == true) {
				this.coreAddPullToRefresh(el);
                this.refreshContainer.style.position="absolute";
                this.refreshContainer.style.top="-60px";
                this.refreshContainer.style.height="60px";
                this.refreshContainer.style.display="block";
			}
		}
		nativeScroller.prototype.onTouchStart = function(e) {

			if(this.refreshCancelCB) clearTimeout(this.refreshCancelCB);
			//get refresh ready
			if(this.refresh || this.infinite) {

				this.el.addEventListener('touchmove', this, false);
				this.dY = e.touches[0].pageY;
				if(this.refresh && this.dY <0) {
					this.showRefresh();

				}
			}
			$.trigger(this,"scrollstart",[this.el]);
			$.trigger($.touchLayer,"scrollstart",[this.el]);
		}
		nativeScroller.prototype.onTouchMove = function(e) {

			var newcY = e.touches[0].pageY - this.dY;

			if(!this.moved) {
				this.el.addEventListener('touchend', this, false);
				this.moved = true;
			}

			var difY = newcY - this.cY;


			//check for trigger
			if(this.refresh && (this.el.scrollTop) < 0) {
				this.showRefresh();
				//check for cancel
			} else if(this.refreshTriggered && this.refresh && (this.el.scrollTop > this.refreshHeight)) {
				this.refreshTriggered = false;
				if(this.refreshCancelCB) clearTimeout(this.refreshCancelCB);
				this.hideRefresh(false);
				$.trigger(this, 'refresh-cancel');
			}

			this.cY = newcY;
			e.stopPropagation();
		}
        nativeScroller.prototype.showRefresh=function(){
            if(!this.refreshTriggered){
                this.refreshTriggered = true;
                $.trigger(this, 'refresh-trigger');
            }
        }
		nativeScroller.prototype.onTouchEnd = function(e) {

			var triggered = this.el.scrollTop <= -(this.refreshHeight);

			this.fireRefreshRelease(triggered, true);
            if(triggered){
                //lock in place
                this.refreshContainer.style.position="relative";
                this.refreshContainer.style.top="0px";
            }

			this.dY = this.cY = 0;
			this.el.removeEventListener('touchmove', this, false);
			this.el.removeEventListener('touchend', this, false);
			this.infiniteEndCheck = true;
			if(this.infinite && !this.infiniteTriggered && (Math.abs(this.el.scrollTop) >= (this.el.scrollHeight - this.el.clientHeight))) {
				this.infiniteTriggered = true;
				$.trigger(this, "infinite-scroll");
				this.infiniteEndCheck = true;
			}
			this.touchEndFired = true;
			//pollyfil for scroll end since webkit doesn't give any events during the "flick"
            var max=200;
            var self=this;
            var currPos={
                top:this.el.scrollTop,
                left:this.el.scrollLeft
            };
            var counter=0;
            self.nativePolling=setInterval(function(){
                counter++;
                if(counter>=max){
                    clearInterval(self.nativePolling);
                    return;
                }
                if(self.el.scrollTop!=currPos.top||self.el.scrollLeft!=currPos.left){
                    clearInterval(self.nativePolling);
                    $.trigger($.touchLayer, 'scrollend', [self.el]); //notify touchLayer of this elements scrollend
                    $.trigger(self,"scrollend",[self.el]);
                    //self.doScroll(e);
                }

            },20);
		}
		nativeScroller.prototype.hideRefresh = function(animate) {

			if(this.preventHideRefresh) return;

			var that = this;
			var endAnimationCb = function(canceled){
					if(!canceled){	//not sure if this should be the correct logic....
						that.el.style[$.feat.cssPrefix+"Transform"]="none";
						that.el.style[$.feat.cssPrefix+"TransitionProperty"]="none";
						that.el.scrollTop=0;
						that.logPos(that.el.scrollLeft, 0);
					}
					that.refreshContainer.style.top = "-60px";
					that.refreshContainer.style.position="absolute";
					that.dY = that.cY = 0;
					$.trigger(that,"refresh-finish");
				};

			if(animate === false || !that.jqEl.css3Animate) {
				endAnimationCb();
			} else {
				that.jqEl.css3Animate({
					y: (that.el.scrollTop - that.refreshHeight) + "px",
					x: "0%",
					time: HIDE_REFRESH_TIME + "ms",
					complete: endAnimationCb
				});
			}
			this.refreshTriggered = false;
			//this.el.addEventListener('touchend', this, false);
		}
		nativeScroller.prototype.hideScrollbars = function() {}
		nativeScroller.prototype.scrollTo = function(pos,time) {
			this.logPos(pos.x, pos.y);
			pos.x*=-1;
			pos.y*=-1;
			return this._scrollTo(pos,time);
		}
		nativeScroller.prototype.scrollBy = function(pos,time) {
			pos.x+=this.el.scrollLeft;
			pos.y+=this.el.scrollTop;
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
			return this._scrollTo(pos,time);
		}
		nativeScroller.prototype.scrollToBottom = function(time) {
			//this.el.scrollTop = this.el.scrollHeight;
			this._scrollToBottom(time);
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
		}
		nativeScroller.prototype.onScroll = function(e) {
			if(this.infinite && this.touchEndFired) {
				this.touchEndFired = false;
				return;
			}
			if(this.scrollSkip) {
				this.scrollSkip = false;
				return;
			}

			if(this.infinite) {
				if(!this.infiniteTriggered && (Math.abs(this.el.scrollTop) >= (this.el.scrollHeight - this.el.clientHeight))) {
					this.infiniteTriggered = true;
					$.trigger(this, "infinite-scroll");
					this.infiniteEndCheck = true;
				}
			}


			var that = this;
			if(this.infinite && this.infiniteEndCheck && this.infiniteTriggered) {

				this.infiniteEndCheck = false;
				$.trigger(that, "infinite-scroll-end");
			}
		}
		nativeScroller.prototype.logPos = function(x, y) {


			this.loggedPcentX = this.divide(x, (this.el.scrollWidth));
			this.loggedPcentY = this.divide(y, (this.el.scrollHeight ));
			this.scrollLeft = x;
			this.scrollTop = y;

			if(isNaN(this.loggedPcentX))
				this.loggedPcentX=0;
			if(isNaN(this.loggedPcentY))
				this.loggedPcentY=0;

		}
		nativeScroller.prototype.adjustScroll = function() {
			this.adjustScrollOverflowProxy_();
			
			this.el.scrollLeft = this.loggedPcentX * (this.el.scrollWidth);
			this.el.scrollTop = this.loggedPcentY * (this.el.scrollHeight );
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
		}



		//JS scroller
		jsScroller.prototype.defaultProperties = function() {

			this.boolScrollLock = false;
			this.currentScrollingObject = null;
			this.elementInfo = null;
			this.verticalScroll = true;
			this.horizontalScroll = false;
			this.scrollBars = true;
			this.vscrollBar = null;
			this.hscrollBar = null;
			this.hScrollCSS = "scrollBar";
			this.vScrollCSS = "scrollBar";
			this.firstEventInfo = null;
			this.moved = false;
			this.preventPullToRefresh = true;
			this.doScrollInterval = null;
			this.refreshRate = 25;
			this.isScrolling = false;
			this.androidFormsMode = false;
			this.refreshSafeKeep = false;

			this.lastScrollbar = "";
			this.finishScrollingObject = null;
			this.container = null;
			this.scrollingFinishCB = null;
			this.loggedPcentY = 0;
			this.loggedPcentX = 0;

		}

		function createScrollBar(width, height) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.position = 'absolute';
			scrollDiv.style.width = width + "px";
			scrollDiv.style.height = height + "px";
			scrollDiv.style[$.feat.cssPrefix+'BorderRadius'] = "2px";
			scrollDiv.style.borderRadius = "2px";
			scrollDiv.style.opacity = 0;
			scrollDiv.className = 'scrollBar';
			scrollDiv.style.background = "black";
			return scrollDiv;
		}
		jsScroller.prototype.enable = function(firstExecution) {
			if(this.eventsActive) return;
			this.eventsActive = true;
			if(!firstExecution) this.adjustScroll();
            else
                this.scrollerMoveCSS({x:0,y:0},0);
			//add listeners
			this.container.addEventListener('touchstart', this, false);
			this.container.addEventListener('touchmove', this, false);
			this.container.addEventListener('touchend', this, false);

		}
		jsScroller.prototype.adjustScroll = function() {
			//set top/left
			var size = this.getViewportSize();
			this.scrollerMoveCSS({
				x: Math.round(this.loggedPcentX * (this.el.clientWidth - size.w)),
				y: Math.round(this.loggedPcentY * (this.el.clientHeight - size.h))
			}, 0);
		}
		jsScroller.prototype.disable = function() {
			if(!this.eventsActive) return;
			//log top/left
			var cssMatrix = this.getCSSMatrix(this.el);
			this.logPos((numOnly(cssMatrix.e) - numOnly(this.container.scrollLeft)), (numOnly(cssMatrix.f) - numOnly(this.container.scrollTop)));
			//remove event listeners
			this.container.removeEventListener('touchstart', this, false);
			this.container.removeEventListener('touchmove', this, false);
			this.container.removeEventListener('touchend', this, false);
			this.eventsActive = false;
		}
		jsScroller.prototype.addPullToRefresh = function(el, leaveRefresh) {
			if(!leaveRefresh) this.refresh = true;
			if(this.refresh && this.refresh == true) {
				this.coreAddPullToRefresh(el);
				this.el.style.overflow = 'visible';
			}
		}
		jsScroller.prototype.hideScrollbars = function() {
			if(this.hscrollBar) {
				this.hscrollBar.style.opacity = 0
				this.hscrollBar.style[$.feat.cssPrefix+'TransitionDuration'] = "0ms";
			}
			if(this.vscrollBar) {
				this.vscrollBar.style.opacity = 0
				this.vscrollBar.style[$.feat.cssPrefix+'TransitionDuration']  = "0ms";
			}
		}

		jsScroller.prototype.getViewportSize = function() {
			var style = window.getComputedStyle(this.container);
			if(isNaN(numOnly(style.paddingTop))) alert((typeof style.paddingTop) + '::' + style.paddingTop + ':');
			return {
				h: (this.container.clientHeight > window.innerHeight ? window.innerHeight : this.container.clientHeight - numOnly(style.paddingTop) - numOnly(style.paddingBottom)),
				w: (this.container.clientWidth > window.innerWidth ? window.innerWidth : this.container.clientWidth - numOnly(style.paddingLeft) - numOnly(style.paddingRight))
			};
		}

		jsScroller.prototype.onTouchStart = function(event) {

			this.moved = false;
			this.currentScrollingObject = null;

			if(!this.container) return;
			if(this.refreshCancelCB) {
				clearTimeout(this.refreshCancelCB);
				this.refreshCancelCB = null;
			}
			if(this.scrollingFinishCB) {
				clearTimeout(this.scrollingFinishCB);
				this.scrollingFinishCB = null;
			}
			

			//disable if locked
			if(event.touches.length != 1 || this.boolScrollLock) return;

			// Allow interaction to legit calls, like select boxes, etc.
			if(event.touches[0].target && event.touches[0].target.type != undefined) {
				var tagname = event.touches[0].target.tagName.toLowerCase();
				if(tagname == "select" || tagname == "input" || tagname == "button") // stuff we need to allow
				// access to legit calls
				return;

			}

			//default variables
			var scrollInfo = {
				//current position
				top: 0,
				left: 0,
				//current movement
				speedY: 0,
				speedX: 0,
				absSpeedY: 0,
				absSpeedX: 0,
				deltaY: 0,
				deltaX: 0,
				absDeltaY: 0,
				absDeltaX: 0,
				y: 0,
				x: 0,
				duration: 0
			};

			//element info
			this.elementInfo = {};
			var size = this.getViewportSize();
			this.elementInfo.bottomMargin = size.h;
			this.elementInfo.maxTop = (this.el.clientHeight - this.elementInfo.bottomMargin);
			if(this.elementInfo.maxTop < 0) this.elementInfo.maxTop = 0;
			this.elementInfo.divHeight = this.el.clientHeight;
			this.elementInfo.rightMargin = size.w;
			this.elementInfo.maxLeft = (this.el.clientWidth - this.elementInfo.rightMargin);
			if(this.elementInfo.maxLeft < 0) this.elementInfo.maxLeft = 0;
			this.elementInfo.divWidth = this.el.clientWidth;
			this.elementInfo.hasVertScroll = this.verticalScroll || this.elementInfo.maxTop > 0;
			this.elementInfo.hasHorScroll = this.elementInfo.maxLeft > 0;
			this.elementInfo.requiresVScrollBar = this.vscrollBar && this.elementInfo.hasVertScroll;
			this.elementInfo.requiresHScrollBar = this.hscrollBar && this.elementInfo.hasHorScroll;

			//save event
			this.saveEventInfo(event);
			this.saveFirstEventInfo(event);

			//get the current top
			var cssMatrix = this.getCSSMatrix(this.el);
			scrollInfo.top = numOnly(cssMatrix.f) - numOnly(this.container.scrollTop);
			scrollInfo.left = numOnly(cssMatrix.e) - numOnly(this.container.scrollLeft);

			this.container.scrollTop = this.container.scrollLeft = 0;
			this.currentScrollingObject = this.el;

			//get refresh ready
			if(this.refresh && scrollInfo.top == 0) {
				this.refreshContainer.style.display = "block";
				this.refreshHeight = this.refreshContainer.firstChild.clientHeight;
				this.refreshContainer.firstChild.style.top = (-this.refreshHeight) + 'px';
				this.refreshContainer.style.overflow = 'visible';
				this.preventPullToRefresh = false;
			} else if(scrollInfo.top < 0) {
				this.preventPullToRefresh = true;
				if(this.refresh) this.refreshContainer.style.overflow = 'hidden';
			}

			//set target
			scrollInfo.x = scrollInfo.left;
			scrollInfo.y = scrollInfo.top;

			//vertical scroll bar
			if(this.setVScrollBar(scrollInfo, 0, 0)){
	            if (this.container.clientWidth > window.innerWidth)
	                this.vscrollBar.style.left = (window.innerWidth - numOnly(this.vscrollBar.style.width) * 3) + "px";
	            else
	                this.vscrollBar.style.right = "0px";
	            this.vscrollBar.style[$.feat.cssPrefix+"Transition"] = '';
				// this.vscrollBar.style.opacity = 1;
			}

			//horizontal scroll
			if(this.setHScrollBar(scrollInfo, 0, 0)){
                if (this.container.clientHeight > window.innerHeight)
                    this.hscrollBar.style.top = (window.innerHeight - numOnly(this.hscrollBar.style.height)) + "px";
                else
                    this.hscrollBar.style.bottom = numOnly(this.hscrollBar.style.height);
                this.hscrollBar.style[$.feat.cssPrefix+"Transition"] = ''; 
				// this.hscrollBar.style.opacity = 1;
			}

			//save scrollInfo
			this.lastScrollInfo = scrollInfo;
			this.hasMoved=true;

			this.scrollerMoveCSS(this.lastScrollInfo, 0);
			$.trigger(this,"scrollstart");

		}
		jsScroller.prototype.getCSSMatrix = function(el) {
			if(this.androidFormsMode) {
				//absolute mode
				var top = parseInt(el.style.marginTop);
				var left = parseInt(el.style.marginLeft);
				if(isNaN(top)) top = 0;
				if(isNaN(left)) left = 0;
				return {
					f: top,
					e: left
				};
			} else {
				//regular transform

				var obj = $.getCssMatrix(el);
				return obj;
			}
		}
		jsScroller.prototype.saveEventInfo = function(event) {
			this.lastEventInfo = {
				pageX: event.touches[0].pageX,
				pageY: event.touches[0].pageY,
				time: event.timeStamp
			}
		}
		jsScroller.prototype.saveFirstEventInfo = function(event) {
			this.firstEventInfo = {
				pageX: event.touches[0].pageX,
				pageY: event.touches[0].pageY,
				time: event.timeStamp
			}
		}
		jsScroller.prototype.setVScrollBar = function(scrollInfo, time, timingFunction) {
			if(!this.elementInfo.requiresVScrollBar) return false;
			var newHeight = (parseFloat(this.elementInfo.bottomMargin / this.elementInfo.divHeight) * this.elementInfo.bottomMargin) + "px";
			if(newHeight != this.vscrollBar.style.height) this.vscrollBar.style.height = newHeight;
			var pos = (this.elementInfo.bottomMargin - numOnly(this.vscrollBar.style.height)) - (((this.elementInfo.maxTop + scrollInfo.y) / this.elementInfo.maxTop) * (this.elementInfo.bottomMargin - numOnly(this.vscrollBar.style.height)));
			if(pos > this.elementInfo.bottomMargin) pos = this.elementInfo.bottomMargin;
			if(pos < 0) pos = 0;
			this.scrollbarMoveCSS(this.vscrollBar, {
				x: 0,
				y: pos
			}, time, timingFunction);
			return true;
		}
		jsScroller.prototype.setHScrollBar = function(scrollInfo, time, timingFunction) {
			if(!this.elementInfo.requiresHScrollBar) return false;
			var newWidth = (parseFloat(this.elementInfo.rightMargin / this.elementInfo.divWidth) * this.elementInfo.rightMargin) + "px";
			if(newWidth != this.hscrollBar.style.width) this.hscrollBar.style.width = newWidth;
			var pos = (this.elementInfo.rightMargin - numOnly(this.hscrollBar.style.width)) - (((this.elementInfo.maxLeft + scrollInfo.x) / this.elementInfo.maxLeft) * (this.elementInfo.rightMargin - numOnly(this.hscrollBar.style.width)));

			if(pos > this.elementInfo.rightMargin) pos = this.elementInfo.rightMargin;
			if(pos < 0) pos = 0;

			this.scrollbarMoveCSS(this.hscrollBar, {
				x: pos,
				y: 0
			}, time, timingFunction);
			return true;
		}

		jsScroller.prototype.onTouchMove = function(event) {

			if(this.currentScrollingObject == null) return;
			//event.preventDefault();
			var scrollInfo = this.calculateMovement(event);
			this.calculateTarget(scrollInfo);

			this.lastScrollInfo = scrollInfo;
			if(!this.moved) {
				if(this.elementInfo.requiresVScrollBar) this.vscrollBar.style.opacity = 1;
				if(this.elementInfo.requiresHScrollBar) this.hscrollBar.style.opacity = 1;
			}
			this.moved = true;


			if(this.refresh && scrollInfo.top == 0) {
				this.refreshContainer.style.display = "block";
				this.refreshHeight = this.refreshContainer.firstChild.clientHeight;
				this.refreshContainer.firstChild.style.top = (-this.refreshHeight) + 'px';
				this.refreshContainer.style.overflow = 'visible';
				this.preventPullToRefresh = false;
			} else if(scrollInfo.top < 0) {
				this.preventPullToRefresh = true;
				if(this.refresh) this.refreshContainer.style.overflow = 'hidden';
			}


			this.saveEventInfo(event);
			this.doScroll();

		}

		jsScroller.prototype.doScroll = function() {

			if(!this.isScrolling && this.lastScrollInfo.x != this.lastScrollInfo.left || this.lastScrollInfo.y != this.lastScrollInfo.top) {
				this.isScrolling = true;
				if(this.onScrollStart) this.onScrollStart();
			} else {
				//nothing to do here, cary on
				return;
			}
			//proceed normally
			var cssMatrix = this.getCSSMatrix(this.el);
			this.lastScrollInfo.top = numOnly(cssMatrix.f);
			this.lastScrollInfo.left = numOnly(cssMatrix.e);

			this.recalculateDeltaY(this.lastScrollInfo);
			this.recalculateDeltaX(this.lastScrollInfo);

			//boundaries control
			this.checkYboundary(this.lastScrollInfo);
			if(this.elementInfo.hasHorScroll) this.checkXboundary(this.lastScrollInfo);

			//pull to refresh elastic
			var positiveOverflow = this.lastScrollInfo.y > 0 && this.lastScrollInfo.deltaY > 0;
			var negativeOverflow = this.lastScrollInfo.y < -this.elementInfo.maxTop && this.lastScrollInfo.deltaY < 0;
			if(positiveOverflow || negativeOverflow) {
				var overflow = positiveOverflow ? this.lastScrollInfo.y : -this.lastScrollInfo.y - this.elementInfo.maxTop;
				var pcent = (this.container.clientHeight - overflow) / this.container.clientHeight;
				if(pcent < .5) pcent = .5;
				//cur top, maxTop or 0?
				var baseTop = 0;
				if((positiveOverflow && this.lastScrollInfo.top > 0) || (negativeOverflow && this.lastScrollInfo.top < -this.elementInfo.maxTop)) {
					baseTop = this.lastScrollInfo.top;
				} else if(negativeOverflow) {
					baseTop = -this.elementInfo.maxTop;
				}
				var changeY = this.lastScrollInfo.deltaY * pcent;
				var absChangeY = Math.abs(this.lastScrollInfo.deltaY * pcent);
				if(absChangeY < 1) changeY = positiveOverflow ? 1 : -1;
				this.lastScrollInfo.y = baseTop + changeY;
			}

			//move
			this.scrollerMoveCSS(this.lastScrollInfo, 0);
			this.setVScrollBar(this.lastScrollInfo, 0, 0);
			this.setHScrollBar(this.lastScrollInfo, 0, 0);

			//check refresh triggering
			if(this.refresh && !this.preventPullToRefresh) {
				if(!this.refreshTriggered && this.lastScrollInfo.top > this.refreshHeight) {
					this.refreshTriggered = true;
					$.trigger(this, 'refresh-trigger');
				} else if(this.refreshTriggered && this.lastScrollInfo.top < this.refreshHeight) {
					this.refreshTriggered = false;
					$.trigger(this, 'refresh-cancel');
				}
			}

			if(this.infinite && !this.infiniteTriggered) {
				if((Math.abs(this.lastScrollInfo.top) >= (this.el.clientHeight - this.container.clientHeight))) {
					this.infiniteTriggered = true;
					$.trigger(this, "infinite-scroll");
				}
			}

		}

		jsScroller.prototype.calculateMovement = function(event, last) {
			//default variables
			var scrollInfo = {
				//current position
				top: 0,
				left: 0,
				//current movement
				speedY: 0,
				speedX: 0,
				absSpeedY: 0,
				absSpeedX: 0,
				deltaY: 0,
				deltaX: 0,
				absDeltaY: 0,
				absDeltaX: 0,
				y: 0,
				x: 0,
				duration: 0
			};

			var prevEventInfo = last ? this.firstEventInfo : this.lastEventInfo;
			var pageX = last ? event.pageX : event.touches[0].pageX;
			var pageY = last ? event.pageY : event.touches[0].pageY;
			var time = last ? event.time : event.timeStamp;

			scrollInfo.deltaY = this.elementInfo.hasVertScroll ? pageY - prevEventInfo.pageY : 0;
			scrollInfo.deltaX = this.elementInfo.hasHorScroll ? pageX - prevEventInfo.pageX : 0;
			scrollInfo.time = time;

			scrollInfo.duration = time - prevEventInfo.time;

			return scrollInfo;
		}

		jsScroller.prototype.calculateTarget = function(scrollInfo) {
			scrollInfo.y = this.lastScrollInfo.y + scrollInfo.deltaY;
			scrollInfo.x = this.lastScrollInfo.x + scrollInfo.deltaX;
		}
		jsScroller.prototype.checkYboundary = function(scrollInfo) {
			var minTop = this.container.clientHeight / 2;
			var maxTop = this.elementInfo.maxTop + minTop;
			//y boundaries
			if(scrollInfo.y > minTop) scrollInfo.y = minTop;
			else if(-scrollInfo.y > maxTop) scrollInfo.y = -maxTop;
			else return;
			this.recalculateDeltaY(scrollInfo);
		}
		jsScroller.prototype.checkXboundary = function(scrollInfo) {
			//x boundaries
			if(scrollInfo.x > 0) scrollInfo.x = 0;
			else if(-scrollInfo.x > this.elementInfo.maxLeft) scrollInfo.x = -this.elementInfo.maxLeft;
			else return;

			this.recalculateDeltaY(scrollInfo);
		}
		jsScroller.prototype.recalculateDeltaY = function(scrollInfo) {
			//recalculate delta
			var oldAbsDeltaY = Math.abs(scrollInfo.deltaY);
			scrollInfo.deltaY = scrollInfo.y - scrollInfo.top;
			newAbsDeltaY = Math.abs(scrollInfo.deltaY);
			//recalculate duration at same speed
			scrollInfo.duration = scrollInfo.duration * newAbsDeltaY / oldAbsDeltaY;

		}
		jsScroller.prototype.recalculateDeltaX = function(scrollInfo) {
			//recalculate delta
			var oldAbsDeltaX = Math.abs(scrollInfo.deltaX);
			scrollInfo.deltaX = scrollInfo.x - scrollInfo.left;
			newAbsDeltaX = Math.abs(scrollInfo.deltaX);
			//recalculate duration at same speed
			scrollInfo.duration = scrollInfo.duration * newAbsDeltaX / oldAbsDeltaX;

		}

		jsScroller.prototype.hideRefresh = function(animate) {
			var that=this;
			if(this.preventHideRefresh) return;
			this.scrollerMoveCSS({
				x: 0,
				y: 0,
				complete:function(){
					$.trigger(that,"refresh-finish");
				}
			}, HIDE_REFRESH_TIME);
			this.refreshTriggered = false;
		}

		jsScroller.prototype.setMomentum = function(scrollInfo) {
			var deceleration = 0.0012;

			//calculate movement speed
			scrollInfo.speedY = this.divide(scrollInfo.deltaY, scrollInfo.duration);
			scrollInfo.speedX = this.divide(scrollInfo.deltaX, scrollInfo.duration);

			scrollInfo.absSpeedY = Math.abs(scrollInfo.speedY);
			scrollInfo.absSpeedX = Math.abs(scrollInfo.speedX);

			scrollInfo.absDeltaY = Math.abs(scrollInfo.deltaY);
			scrollInfo.absDeltaX = Math.abs(scrollInfo.deltaX);

			//set momentum
			if(scrollInfo.absDeltaY > 0) {
				scrollInfo.deltaY = (scrollInfo.deltaY < 0 ? -1 : 1) * (scrollInfo.absSpeedY * scrollInfo.absSpeedY) / (2 * deceleration);
				scrollInfo.absDeltaY = Math.abs(scrollInfo.deltaY);
				scrollInfo.duration = scrollInfo.absSpeedY / deceleration;
				scrollInfo.speedY = scrollInfo.deltaY / scrollInfo.duration;
				scrollInfo.absSpeedY = Math.abs(scrollInfo.speedY);
				if(scrollInfo.absSpeedY < deceleration * 100 || scrollInfo.absDeltaY < 5) scrollInfo.deltaY = scrollInfo.absDeltaY = scrollInfo.duration = scrollInfo.speedY = scrollInfo.absSpeedY = 0;
			} else if(scrollInfo.absDeltaX) {
				scrollInfo.deltaX = (scrollInfo.deltaX < 0 ? -1 : 1) * (scrollInfo.absSpeedX * scrollInfo.absSpeedX) / (2 * deceleration);
				scrollInfo.absDeltaX = Math.abs(scrollInfo.deltaX);
				scrollInfo.duration = scrollInfo.absSpeedX / deceleration;
				scrollInfo.speedX = scrollInfo.deltaX / scrollInfo.duration;
				scrollInfo.absSpeedX = Math.abs(scrollInfo.speedX);
				if(scrollInfo.absSpeedX < deceleration * 100 || scrollInfo.absDeltaX < 5) scrollInfo.deltaX = scrollInfo.absDeltaX = scrollInfo.duration = scrollInfo.speedX = scrollInfo.absSpeedX = 0;
			} else scrollInfo.duration = 0;
		}


		jsScroller.prototype.onTouchEnd = function(event) {


			if(this.currentScrollingObject == null || !this.moved) return;
			//event.preventDefault();
			this.finishScrollingObject = this.currentScrollingObject;
			this.currentScrollingObject = null;

			var scrollInfo = this.calculateMovement(this.lastEventInfo, true);
			if(!this.androidFormsMode) {
				this.setMomentum(scrollInfo);
			}
			this.calculateTarget(scrollInfo);

			//get the current top
			var cssMatrix = this.getCSSMatrix(this.el);
			scrollInfo.top = numOnly(cssMatrix.f);
			scrollInfo.left = numOnly(cssMatrix.e);

			//boundaries control
			this.checkYboundary(scrollInfo);
			if(this.elementInfo.hasHorScroll) this.checkXboundary(scrollInfo);

			var triggered = !this.preventPullToRefresh && (scrollInfo.top > this.refreshHeight || scrollInfo.y > this.refreshHeight);
			this.fireRefreshRelease(triggered, scrollInfo.top > 0);

			//refresh hang in
			if(this.refresh && triggered) {
				scrollInfo.y = this.refreshHeight;
				scrollInfo.duration = HIDE_REFRESH_TIME;
				//top boundary
			} else if(scrollInfo.y >= 0) {
				scrollInfo.y = 0;
				if(scrollInfo.top >= 0) scrollInfo.duration = HIDE_REFRESH_TIME;
				//lower boundary
			} else if(-scrollInfo.y > this.elementInfo.maxTop || this.elementInfo.maxTop == 0) {
				scrollInfo.y = -this.elementInfo.maxTop;
				if(-scrollInfo.top > this.elementInfo.maxTop) scrollInfo.duration = HIDE_REFRESH_TIME;
				//all others
			}

			if(this.androidFormsMode) scrollInfo.duration = 0;
			this.scrollerMoveCSS(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");
			this.setVScrollBar(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");
			this.setHScrollBar(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");

			this.setFinishCalback(scrollInfo.duration);
			if(this.infinite && !this.infiniteTriggered) {
				if((Math.abs(scrollInfo.y) >= (this.el.clientHeight - this.container.clientHeight))) {
					this.infiniteTriggered = true;
					$.trigger(this, "infinite-scroll");
				}
			}
		}

		//finish callback
		jsScroller.prototype.setFinishCalback = function(duration) {
			var that = this;
			this.scrollingFinishCB = setTimeout(function() {
				that.hideScrollbars();
				$.trigger($.touchLayer, 'scrollend', [that.el]); //notify touchLayer of this elements scrollend
				$.trigger(that,"scrollend",[that.el]);
				that.isScrolling = false;
				that.elementInfo = null; //reset elementInfo when idle
				if(that.infinite) $.trigger(that, "infinite-scroll-end");
			}, duration);
		}

		//Android Forms Fix
		jsScroller.prototype.startFormsMode = function() {
			if(this.blockFormsFix) return;
			//get prev values
			var cssMatrix = this.getCSSMatrix(this.el);
			//toggle vars
			this.refreshSafeKeep = this.refresh;
			this.refresh = false;
			this.androidFormsMode = true;
			//set new css rules
			this.el.style[$.feat.cssPrefix+"Transform"] = "none";
			this.el.style[$.feat.cssPrefix+"Transition"] = "none";
			this.el.style[$.feat.cssPrefix+"Perspective"] = "none";

			//set position
			this.scrollerMoveCSS({
				x: numOnly(cssMatrix.e),
				y: numOnly(cssMatrix.f)
			}, 0);

			//container
			this.container.style[$.feat.cssPrefix+"Perspective"] = "none";
			this.container.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
			//scrollbars
			if(this.vscrollBar){
				this.vscrollBar.style[$.feat.cssPrefix+"Transform"] = "none";
				this.vscrollBar.style[$.feat.cssPrefix+"Transition"] = "none";
				this.vscrollBar.style[$.feat.cssPrefix+"Perspective"] = "none";
				this.vscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
			}
			if(this.hscrollBar){
				this.hscrollBar.style[$.feat.cssPrefix+"Transform"] = "none";
				this.hscrollBar.style[$.feat.cssPrefix+"Transition"] = "none";
				this.hscrollBar.style[$.feat.cssPrefix+"Perspective"] = "none";
				this.hscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
			}

		}
		jsScroller.prototype.stopFormsMode = function() {
			if(this.blockFormsFix) return;
			//get prev values
			var cssMatrix = this.getCSSMatrix(this.el);
			//toggle vars
			this.refresh = this.refreshSafeKeep;
			this.androidFormsMode = false;
			//set new css rules
			this.el.style[$.feat.cssPrefix+"Perspective"] = 1000;
			this.el.style.marginTop = 0;
			this.el.style.marginLeft = 0;
			this.el.style[$.feat.cssPrefix+"Transition"] = '0ms linear';	//reactivate transitions
			//set position
			this.scrollerMoveCSS({
				x: numOnly(cssMatrix.e),
				y: numOnly(cssMatrix.f)
			}, 0);
			//container
			this.container.style[$.feat.cssPrefix+"Perspective"] = 1000;
			this.container.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
			//scrollbars
			if(this.vscrollBar){
				this.vscrollBar.style[$.feat.cssPrefix+"Perspective"] = 1000;
				this.vscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
			}
			if(this.hscrollBar){
				this.hscrollBar.style[$.feat.cssPrefix+"Perspective"] = 1000;
				this.hscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
			}

		}



		jsScroller.prototype.scrollerMoveCSS = function(distanceToMove, time, timingFunction) {
			if(!time) time = 0;
			if(!timingFunction) timingFunction = "linear";
			time=numOnly(time);
			if(this.el && this.el.style) {

				//do not touch the DOM if disabled
				if(this.eventsActive) {
					if(this.androidFormsMode) {
						this.el.style.marginTop = Math.round(distanceToMove.y) + "px";
						this.el.style.marginLeft = Math.round(distanceToMove.x) + "px";
					} else {

			            this.el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
			            this.el.style[$.feat.cssPrefix+"TransitionDuration"]= time + "ms";
			            this.el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
					}
				}
				// Position should be updated even when the scroller is disabled so we log the change
				this.logPos(distanceToMove.x, distanceToMove.y);
			}
		}
		jsScroller.prototype.logPos = function(x, y) {

			if(!this.elementInfo) {
				var size = this.getViewportSize();
			} else {
				var size = {
					h: this.elementInfo.bottomMargin,
					w: this.elementInfo.rightMargin
				}
			}

			this.loggedPcentX = this.divide(x, (this.el.clientWidth - size.w));
			this.loggedPcentY = this.divide(y, (this.el.clientHeight - size.h));
			this.scrollTop = y;
			this.scrollLeft = x;
		}
		jsScroller.prototype.scrollbarMoveCSS = function(el, distanceToMove, time, timingFunction) {
			if(!time) time = 0;
			if(!timingFunction) timingFunction = "linear";

			if(el && el.style) {
				if(this.androidFormsMode) {
					el.style.marginTop = Math.round(distanceToMove.y) + "px";
					el.style.marginLeft = Math.round(distanceToMove.x) + "px";
				} else {
		            el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
		            el.style[$.feat.cssPrefix+"TransitionDuration"]= time + "ms";
		            el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
				}
			}
		}
		jsScroller.prototype.scrollTo = function(pos, time) {
			if(!time) time = 0;
			this.scrollerMoveCSS(pos, time);
		}
		jsScroller.prototype.scrollBy = function(pos, time) {
			var cssMatrix = this.getCSSMatrix(this.el);
			var startTop = numOnly(cssMatrix.f);
			var startLeft = numOnly(cssMatrix.e);
			this.scrollTo({
				y: startTop - pos.y,
				x: startLeft - pos.x
			}, time);
		}
		jsScroller.prototype.scrollToBottom = function(time) {
			this.scrollTo({
				y: -1 * (this.el.clientHeight - this.container.clientHeight),
				x: 0
			}, time);
		}
		jsScroller.prototype.scrollToTop=function(time){
			this.scrollTo({x:0,y:0},time);
		}
		return scroller;
	})();
})(jq);
/*
 * @copyright: 2011 Intel
 * @description:  This script will replace all drop downs with friendly select controls.  Users can still interact
 * with the old drop down box as normal with javascript, and this will be reflected
 
 */
(function($) {
    $['selectBox'] = {
        scroller: null,
        getOldSelects: function(elID) {
            if (!$.os.android || $.os.androidICS)
               return;
            if (!$.fn['scroller']) {
                alert("This library requires jq.web.Scroller");
                return;
            }
            var container = elID && document.getElementById(elID) ? document.getElementById(elID) : document;
            if (!container) {
                alert("Could not find container element for jq.web.selectBox " + elID);
                return;
            }
            var sels = container.getElementsByTagName("select");
            var that = this;
            for (var i = 0; i < sels.length; i++) {
                if (sels[i].hasSelectBoxFix)
                    continue;
                (function(theSel) {
                    var fakeInput = document.createElement("div");
					var theSelStyle = window.getComputedStyle(theSel);
					var width = theSelStyle.width=='intrinsic' ? '100%' : theSelStyle.width;
                    var selWidth = parseInt(width) > 0 ? width : '100px';
                    var selHeight = parseInt(theSel.style.height) > 0 ? theSel.style.height : (parseInt(theSelStyle.height) ? theSelStyle.height : '20px');
                    fakeInput.style.width = selWidth;
                    fakeInput.style.height = selHeight;
					fakeInput.style.margin = theSelStyle.margin;
					fakeInput.style.position = theSelStyle.position;
					fakeInput.style.left = theSelStyle.left;
					fakeInput.style.top = theSelStyle.top;
					fakeInput.style.lineHeight = theSelStyle.lineHeight;
                    //fakeInput.style.position = "absolute";
                    //fakeInput.style.left = "0px";
                    //fakeInput.style.top = "0px";
                    fakeInput.style.zIndex = "1";
                    if (theSel.value)
                        fakeInput.innerHTML = theSel.options[theSel.selectedIndex].text;
                    fakeInput.style.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAeCAIAAABFWWJ4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NjQxRUQxNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NjQxRUQyNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU2NDFFQ0Y1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU2NDFFRDA1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YWbdCAAAAlklEQVR42mIsKChgIBGwAHFPTw/xGkpKSlggrG/fvhGjgYuLC0gyMZAOoPb8//9/0Or59+8f8XrICQN66SEnDOgcp3AgKiqKqej169dY9Hz69AnCuHv3rrKyMrIKoAhcVlBQELt/gIqwstHD4B8quH37NlAQSKKJEwg3iLbBED8kpeshoGcwh5uuri5peoBFMEluAwgwAK+5aXfuRb4gAAAAAElFTkSuQmCC') right top no-repeat";
                    fakeInput.style.backgroundColor = "white";
                    fakeInput.style.lineHeight = selHeight;
                    fakeInput.style.backgroundSize = "contain"; 
                    fakeInput.className = "jqmobiSelect_fakeInput " + theSel.className;
                    fakeInput.id = theSel.id + "_jqmobiSelect";
                    
                    fakeInput.style.border = "1px solid gray";
                    fakeInput.style.color = "black";
                    fakeInput.linkId = theSel.id;
                    fakeInput.onclick = function(e) {
                        that.initDropDown(this.linkId);
                    };
                    $(fakeInput).insertBefore($(theSel));
                    //theSel.parentNode.style.position = "relative";
                    theSel.style.display = "none";
                    theSel.style.webkitAppearance = "none";
                    // Create listeners to watch when the select value has changed.
                    // This is needed so the users can continue to interact as normal,
                    // via jquery or other frameworks
                    for (var j = 0; j < theSel.options.length; j++) {
                        if (theSel.options[j].selected) {
                            fakeInput.value = theSel.options[j].text;
                        }
                        theSel.options[j].watch( "selected", function(prop, oldValue, newValue) {
                            if (newValue == true) {
                                if(!theSel.getAttribute("multiple"))
                                that.updateMaskValue(this.parentNode.id, this.text, this.value);
                                this.parentNode.value = this.value;
                            }
                            return newValue;
                        });
                    }
                    theSel.watch("selectedIndex", function(prop, oldValue, newValue) {
                        if (this.options[newValue]) {
                            if(!theSel.getAttribute("multiple"))
                            that.updateMaskValue(this.id, this.options[newValue].text, this.options[newValue].value);
                            this.value = this.options[newValue].value;
                        }
                        return newValue;
                    });
                    
                    fakeInput = null;
                    imageMask = null;
                    sels[i].hasSelectBoxFix = true;
                
                
                })(sels[i]);
            }
            that.createHtml();
        },
        updateDropdown: function(id) {
            var el = document.getElementById(id);
            if (!el)
                return;
            for (var j = 0; j < el.options.length; j++) {
                if (el.options[j].selected)
                    fakeInput.value = el.options[j].text;
                el.options[j].watch("selected", function(prop, oldValue, newValue) {
                    if (newValue == true) {
                        that.updateMaskValue(this.parentNode.id, this.text, this.value);
                        this.parentNode.value = this.value;
                    }
                    return newValue;
                });
            }
            el = null;
        },
        initDropDown: function(elID) {
            
            var that = this;
            var el = document.getElementById(elID);
            if (el.disabled)
                return;
            if (!el || !el.options || el.options.length == 0)
                return;
            var htmlTemplate = "";
            var foundInd = 0;
            document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
            
            document.getElementById("jqmobiSelectBoxHeaderTitle").innerHTML = (el.name != undefined && el.name != "undefined" && el.name != "" ? el.name : elID);
            
            for (var j = 0; j < el.options.length; j++) {
                var currInd = j;
                el.options[j].watch( "selected", function(prop, oldValue, newValue) {
                    if (newValue == true) {
                        that.updateMaskValue(this.parentNode.id, this.text, this.value);
                        this.parentNode.value = this.value;
                    }
                    return newValue;
                });
                var checked = (el.options[j].selected) ? true : false;
                var button = "";
                var div = document.createElement("div");
                div.className = "jqmobiSelectRow";
               // div.id = foundID;
                div.style.cssText = ";line-height:40px;font-size:14px;padding-left:10px;height:40px;width:100%;position:relative;width:100%;border-bottom:1px solid black;background:white;";
                var anchor = document.createElement("a");
                anchor.href = "javascript:;";
                div.tmpValue = j;
                div.onclick = function(e) {
                    that.setDropDownValue(elID, this.tmpValue,this);
                };
                anchor.style.cssText = "text-decoration:none;color:black;";
                anchor.innerHTML = el.options[j].text;
                var span = document.createElement("span");
                span.style.cssText = "float:right;margin-right:20px;margin-top:-2px";
                var rad = document.createElement("button");
                if (checked) {
                    rad.style.cssText = "background: #000;padding: 0px 0px;border-radius:15px;border:3px solid black;";
                    rad.className = "jqmobiSelectRowButtonFound";
                } else {
                    rad.style.cssText = "background: #ffffff;padding: 0px 0px;border-radius:15px;border:3px solid black;";
                    rad.className = "jqmobiSelectRowButton";
                }
                rad.style.width = "20px";
                rad.style.height = "20px";
                
                rad.checked = checked;
                
                anchor.className = "jqmobiSelectRowText";
                span.appendChild(rad);
                div.appendChild(anchor);
                div.appendChild(span);
                
                document.getElementById("jqmobiSelectBoxScroll").appendChild(div);
                
                span = null;
                rad = null;
                anchor = null;
            }
            try {
                document.getElementById("jqmobiSelectModal").style.display = 'block';
            } catch (e) {
                0;
            }
            try {
                if (div) {
                    var scrollThreshold = numOnly(div.style.height);
                    var offset = numOnly(document.getElementById("jqmobiSelectBoxHeader").style.height);
                    
                    if (foundInd * scrollThreshold + offset >= numOnly(document.getElementById("jqmobiSelectBoxFix").clientHeight) - offset)
                        var scrollToPos = (foundInd) * -scrollThreshold + offset;
                    else
                        scrollToPos = 0;
                    this.scroller.scrollTo({
                        x: 0,
                        y: scrollToPos
                    });
                }
            } catch (e) {
                0;
            }
            div = null;
            el = null;
        },
        updateMaskValue: function(elID, value, val2) {
            
            var el = document.getElementById(elID + "_jqmobiSelect");
            var el2 = document.getElementById(elID);
            if (el)
                el.innerHTML = value;
            if (typeof (el2.onchange) == "function")
                el2.onchange(val2);
            el = null;
            el2 = null;
        },
        setDropDownValue: function(elID, value,div) {
            
            
            var el = document.getElementById(elID);
            if(!el)
                return

            if(!el.getAttribute("multiple")){
                el.selectedIndex = value;
                $(el).find("option").forEach(function(obj){
                    obj.selected=false;
                });  
                $(el).find("option:nth-child("+(value+1)+")").get(0).selected=true;
            this.scroller.scrollTo({
                x: 0,
                y: 0
            });
            this.hideDropDown();
            }
            else {
                //multi select
                
                var myEl=$(el).find("option:nth-child("+(value+1)+")").get(0);
                if(myEl.selected){
                    myEl.selected=false;
                    $(div).find("button").css("background","#fff");    
                }
                else {
                     myEl.selected=true;
                    $(div).find("button").css("background","#000");  
                }

            }
            $(el).trigger("change");
            el = null;
        },
        hideDropDown: function() {
            document.getElementById("jqmobiSelectModal").style.display = 'none';
            document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
        },
        createHtml: function() {
            var that = this;
            if (document.getElementById("jqmobiSelectBoxContainer")) {
                return;
            }
            var modalDiv = document.createElement("div");
            
            modalDiv.style.cssText = "position:absolute;top:0px;bottom:0px;left:0px;right:0px;background:rgba(0,0,0,.7);z-index:200000;display:none;";
            modalDiv.id = "jqmobiSelectModal";
            
            var myDiv = document.createElement("div");
            myDiv.id = "jqmobiSelectBoxContainer";
            myDiv.style.cssText = "position:absolute;top:8%;bottom:10%;display:block;width:90%;margin:auto;margin-left:5%;height:90%px;background:white;color:black;border:1px solid black;border-radius:6px;";
            myDiv.innerHTML = "<div id='jqmobiSelectBoxHeader' style=\"display:block;font-family:'Eurostile-Bold', Eurostile, Helvetica, Arial, sans-serif;color:#fff;font-weight:bold;font-size:18px;line-height:34px;height:34px; text-transform:uppercase;text-align:left;text-shadow:rgba(0,0,0,.9) 0px -1px 1px;    padding: 0px 8px 0px 8px;    border-top-left-radius:5px; border-top-right-radius:5px; -webkit-border-top-left-radius:5px; -webkit-border-top-right-radius:5px;    background:#39424b;    margin:1px;\"><div style='float:left;' id='jqmobiSelectBoxHeaderTitle'></div><div style='float:right;width:60px;margin-top:-5px'><div id='jqmobiSelectClose' class='button' style='width:60px;height:32px;line-height:32px;'>Close</div></div></div>";
            myDiv.innerHTML += '<div id="jqmobiSelectBoxFix"  style="position:relative;height:90%;background:white;overflow:hidden;width:100%;"><div id="jqmobiSelectBoxScroll"></div></div>';
            var that = this;
            modalDiv.appendChild(myDiv);
            
            $(document).ready(function() {
               
                if(jq("#ui_kit"))
                   jq("#ui_kit").append(modalDiv);
                else
                    document.body.appendChild(modalDiv);
                var close = $("#jqmobiSelectClose").get();
                close.onclick = function() {
                    that.hideDropDown();
                };
                
                var styleSheet = $("<style>.jqselectscrollBarV{opacity:1 !important;}</style>").get();
                document.body.appendChild(styleSheet);
                try {
                    that.scroller = $("#jqmobiSelectBoxScroll").scroller({
                        scroller: false,
                        verticalScroll: true,
                        vScrollCSS: "jqselectscrollBarV"
                    });
                
                } catch (e) {
                    0;
                }
                modalDiv = null;
                myDiv = null;
                styleSheet = null;
            });
        }
    };

//The following is based off Eli Grey's shim
//https://gist.github.com/384583
//We use HTMLElement to not cause problems with other objects
if (!HTMLElement.prototype.watch) {
	HTMLElement.prototype.watch = function (prop, handler) {
		var oldval = this[prop], newval = oldval,
		getter = function () {
			return newval;
		},
		setter = function (val) {
			oldval = newval;
			return newval = handler.call(this, prop, oldval, val);
		};
		if (delete this[prop]) { // can't watch constants
			if (HTMLElement.defineProperty) { // ECMAScript 5
				HTMLElement.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: false,
					configurable: true
				});
			} else if (HTMLElement.prototype.__defineGetter__ && HTMLElement.prototype.__defineSetter__) { // legacy
				HTMLElement.prototype.__defineGetter__.call(this, prop, getter);
				HTMLElement.prototype.__defineSetter__.call(this, prop, setter);
			}
		}
	};
}
if (!HTMLElement.prototype.unwatch) {
	HTMLElement.prototype.unwatch = function (prop) {
		var val = this[prop];
		delete this[prop]; // remove accessors
		this[prop] = val;
	};
}   
})(jq);

/**
 * $().swipe - a library to detect swipe events for jqMobi apps
 * Copyright 2011 - Intel 
 * Executes a callback function and passes in the direction return
 * @string (left,right,up,down)
 */ 
(function($) {
    var cache = [];
    $.fn["swipeListener"] = function(opts) {
        
        if (opts === undefined && this.length > 0) 
        {
            return cache[this[0].id] ? cache[this[0].id] : null;
        }
        for (var i = 0; i < this.length; i++) {
            tmp = new swipeListener(this[i], opts);
            if (this[i].id)
                cache[this[i].id] = tmp;
        }
        return this.length == 1 ? tmp : this;
    };
    var swipeListener = (function() {
        var swipeListener = function(elID, opts) {
            var that = this;
            if (typeof (elID) == "string")
                this.el = document.getElementById(elID);
            else
                this.el = elID
            if (!this.el) {
                alert("Error adding swipe listener for " + elID);
                return;
            }
            this.el.addEventListener('touchmove', function(e) {
                that.touchMove(e);
            }, false);
            this.el.addEventListener('touchend', function(e) {
                that.touchEnd(e);
            }, false);
            for (j in opts) {
                this[j] = opts[j];
            }
        };
        
        swipeListener.prototype = {
            startX: 0,
            startY: 0,
            movingX: 0,
            movingY: 0,
            vthreshold: 50,
            hthreshold: 50,
            movingElement: false,
            swipeDirection: {
                up: false,
                down: false,
                left: false,
                right: false
            },
            callBack: null,
            
            cancel: function() {
                this.startX = 0;
                this.startY = 0;
                this.movingX = 0;
                this.movingY = 0;
                this.movingElement = false;
                this.swipeDirection = {
                    up: false,
                    down: false,
                    left: false,
                    right: false
                };
            },
            touchStart: function(event) {
                if (event.touches[0].target && event.touches[0].target.type != undefined) {
                    return;
                }
                if (event.touches.length == 1) {
                    this.movingElement = true;
                    this.startX = event.touches[0].pageX;
                    this.startY = event.touches[0].pageY;
                    event.preventDefault();
                }
            },
            touchMove: function(event) {
                if (this.movingElement == false)
                    this.touchStart(event);
                event.preventDefault();
                if (event.touches.length > 1 || !this.movingElement) {
                    this.cancel();
                    return;
                }
                this.movingX = event.touches[0].pageX - this.startX;
                this.movingY = event.touches[0].pageY - this.startY;
            },
            touchEnd: function(event) {
                if (!this.movingElement)
                    return;
                event.preventDefault();
                var swiped = false;
                if (Math.abs(this.movingX) > this.hthreshold) {
                    this.swipeDirection.right = this.movingX > 0;
                    this.swipeDirection.left = this.movingX < 0;
                    swiped = true;
                }
                if (Math.abs(this.movingY) > this.vthreshold) {
                    this.swipeDirection.up = this.movingY < 0;
                    this.swipeDirection.down = this.movingY > 0;
                    swiped = true;
                }
                if (swiped && typeof (this.callBack == "function"))
                    this.callBack(this.swipeDirection);
                
                this.cancel();
            }
        };
        return swipeListener;
    })();

    // Helper function to get only
   
})(jq);
//Touch events are from zepto/touch.js
(function($) {
    var touch = {}, touchTimeout;
    
    function parentIfText(node) {
        return 'tagName' in node ? node : node.parentNode;
    }
    
    function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        if (xDelta >= yDelta) {
            return (x1 - x2 > 0 ? 'Left' : 'Right');
        } else {
            return (y1 - y2 > 0 ? 'Up' : 'Down');
        }
    }
    
    var longTapDelay = 750;
    function longTap() {
        if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
            touch.el.trigger('longTap');
            touch = {};
        }
    }
    var longTapTimer;
    $(document).ready(function() {
        var prevEl;
        $(document.body).bind('touchstart', function(e) {
            if(!e.touches||e.touches.length==0) return;
            var now = Date.now(), delta = now - (touch.last || now);
            if(!e.touches||e.touches.length==0) return;
            touch.el = $(parentIfText(e.touches[0].target));
            touchTimeout && clearTimeout(touchTimeout);
            touch.x1 =  e.touches[0].pageX;
            touch.y1 = e.touches[0].pageY;
            touch.x2=touch.y2=0;
            if (delta > 0 && delta <= 250)
                touch.isDoubleTap = true;
            touch.last = now;
           longTapTimer=setTimeout(longTap, longTapDelay);
            if (!touch.el.data("ignore-pressed"))
                touch.el.addClass("selected");
            if(prevEl&&!prevEl.data("ignore-pressed"))
                prevEl.removeClass("selected");
            prevEl=touch.el;
        }).bind('touchmove', function(e) {
            touch.x2 = e.touches[0].pageX;
            touch.y2 = e.touches[0].pageY;
            clearTimeout(longTapTimer);
        }).bind('touchend', function(e) {

            if (!touch.el)
                return;
            if (!touch.el.data("ignore-pressed"))
                touch.el.removeClass("selected");
            if (touch.isDoubleTap) {
                touch.el.trigger('doubleTap');
                touch = {};
            } else if (touch.x2 > 0 || touch.y2 > 0) {
                (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) && 
                touch.el.trigger('swipe') && 
                touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
            } else if ('last' in touch) {
                touch.el.trigger('tap');

                
                touchTimeout = setTimeout(function() {
                    touchTimeout = null;
                    if (touch.el)
                        touch.el.trigger('singleTap');
                    touch = {};
                }, 250);
            }
        }).bind('touchcancel', function() {
            if(touch.el&& !touch.el.data("ignore-pressed"))
                touch.el.removeClass("selected");
            touch = {};
            clearTimeout(longTapTimer);

        });
    });
    
    ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m) {
        $.fn[m] = function(callback) {
            return this.bind(m, callback)
        }
    });
})(jq);

//TouchLayer contributed by Carlos Ouro @ Badoo
//un-authoritive layer between touches and actions on the DOM 
//(un-authoritive: listeners do not require useCapture)
//handles overlooking JS and native scrolling, panning, 
//no delay on click, edit mode focus, preventing defaults, resizing content, 
//enter/exit edit mode (keyboard on screen), prevent clicks on momentum, etc
//It can be used independently in other apps but it is required by jqUi
//Object Events
//Enter Edit Mode:
//pre-enter-edit - when a possible enter-edit is actioned - happens before actual click or focus (android can still reposition elements and event is actioned)
//cancel-enter-edit - when a pre-enter-edit does not result in a enter-edit
//enter-edit - on a enter edit mode focus
//enter-edit-reshape - focus resized/scrolled event
//in-edit-reshape - resized/scrolled event when a different element is focused
//Exit Edit Mode
//exit-edit - on blur
//exit-edit-reshape - blur resized/scrolled event
//Other
//orientationchange-reshape - resize event due to an orientationchange action
//reshape - window.resize/window.scroll event (ignores onfocus "shaking") - general reshape notice
(function() {

	//singleton
	$.touchLayer = function(el) {
	//	if(jq.os.desktop||!jq.os.webkit) return;
		$.touchLayer = new touchLayer(el);
		return $.touchLayer;
	};
	//configuration stuff
	var inputElements = ['input', 'select', 'textarea'];
	var autoBlurInputTypes = ['button', 'radio', 'checkbox', 'range','date'];
	var requiresJSFocus = $.os.ios; //devices which require .focus() on dynamic click events
	var verySensitiveTouch = $.os.blackberry; //devices which have a very sensitive touch and touchmove is easily fired even on simple taps
	var inputElementRequiresNativeTap = $.os.blackberry || ($.os.android && !$.os.chrome); //devices which require the touchstart event to bleed through in order to actually fire the click on select elements
	var selectElementRequiresNativeTap = $.os.blackberry || ($.os.android && !$.os.chrome); //devices which require the touchstart event to bleed through in order to actually fire the click on select elements
	var focusScrolls = $.os.ios; //devices scrolling on focus instead of resizing
	var focusResizes = $.os.blackberry10;
	var requirePanning = $.os.ios; //devices which require panning feature
	var addressBarError = 0.97; //max 3% error in position
	var maxHideTries = 2; //HideAdressBar does not retry more than 2 times (3 overall)
	var skipTouchEnd=false; //Fix iOS bug with alerts/confirms
	function getTime(){
		var d = new Date();
		var n = d.getTime();
		return n;
	}
	var touchLayer = function(el) {
			this.clearTouchVars();
			el.addEventListener('touchstart', this, false);
			el.addEventListener('touchmove', this, false);
			el.addEventListener('touchend', this, false);
			el.addEventListener('click', this, false);
			el.addEventListener("focusin",this,false);
			document.addEventListener('scroll', this, false);
			window.addEventListener("resize", this, false);
			window.addEventListener("orientationchange", this, false);
			this.layer = el;
			//proxies
			this.scrollEndedProxy_ = $.proxy(this.scrollEnded, this);
			this.exitEditProxy_ = $.proxy(this.exitExit, this, []);
			this.launchFixUIProxy_ = $.proxy(this.launchFixUI, this);
			var that = this;
			this.scrollTimeoutExpireProxy_ = function() {
				that.scrollTimeout_ = null;
				that.scrollTimeoutEl_.addEventListener('scroll', that.scrollEndedProxy_, false);
			};
			this.retestAndFixUIProxy_ = function() {
				if(jq.os.android) that.layer.style.height = '100%';
				$.asap(that.testAndFixUI, that, arguments);
			};
			//iPhone double clicks workaround
			document.addEventListener('click', function(e) {
				if(e.clientX!==undefined&&that.lastTouchStartX!=null)
				{
					if(2>Math.abs(that.lastTouchStartX-e.clientX)&&2>Math.abs(that.lastTouchStartY-e.clientY)){
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}, true);
			//js scrollers self binding
			$.bind(this, 'scrollstart', function(el) {
				that.isScrolling=true;
				that.scrollingEl_=el;
				that.fireEvent('UIEvents', 'scrollstart', el, false, false);
			});
			$.bind(this, 'scrollend', function(el) {
				that.isScrolling=false;

				that.fireEvent('UIEvents', 'scrollend', el, false, false);
			});
			//fix layer positioning
			this.launchFixUI(5); //try a lot to set page into place
		}

	touchLayer.prototype = {
		dX: 0,
		dY: 0,
		cX: 0,
		cY: 0,
		touchStartX:null,
		touchStartY:null,
		//elements
		layer: null,
		scrollingEl_: null,
		scrollTimeoutEl_: null,
		//handles / proxies
		scrollTimeout_: null,
		reshapeTimeout_: null,
		scrollEndedProxy_: null,
		exitEditProxy_: null,
		launchFixUIProxy_: null,
		reHideAddressBarTimeout_: null,
		retestAndFixUIProxy_: null,
		//options
		panElementId: "header",
		//public locks
		blockClicks: false,
		//private locks
		allowDocumentScroll_: false,
		ignoreNextResize_: false,
		blockPossibleClick_: false,
		//status vars
		isScrolling: false,
		isScrollingVertical_: false,
		wasPanning_: false,
		isPanning_: false,
		isFocused_: false,
		justBlurred_: false,
		requiresNativeTap: false,
		holdingReshapeType_: null,

		handleEvent: function(e) {
			switch(e.type) {
			case 'touchstart':
				this.onTouchStart(e);
				break;
			case 'touchmove':
				this.onTouchMove(e);
				break;
			case 'touchend':
				this.onTouchEnd(e);
				break;
			case 'click':
				this.onClick(e);
				break;
			case 'blur':
				this.onBlur(e);
				break;
			case 'scroll':
				this.onScroll(e);
				break;
			case 'orientationchange':
				this.onOrientationChange(e);
				break;
			case 'resize':
				this.onResize(e);
				break;
			case 'focusin':
				this.onFocusIn(e);
				break;
			}
		},
		launchFixUI: function(maxTries) {
			//this.log("launchFixUI");
			if(!maxTries) maxTries = maxHideTries;
			if(this.reHideAddressBarTimeout_ == null) return this.testAndFixUI(0, maxTries);
		},
		resetFixUI: function() {
			//this.log("resetFixUI");
			if(this.reHideAddressBarTimeout_) clearTimeout(this.reHideAddressBarTimeout_);
			this.reHideAddressBarTimeout_ = null;
		},
		testAndFixUI: function(retry, maxTries) {
			//this.log("testAndFixUI");
			//for ios or if the heights are incompatible (and not close)
			var refH = this.getReferenceHeight();
			var curH = this.getCurrentHeight();
			if((refH != curH && !(curH * addressBarError < refH && refH * addressBarError < curH))) {
				//panic! page is out of place!
				this.hideAddressBar(retry, maxTries);
				return true;
			}
			if(jq.os.android) this.resetFixUI();
			return false;
		},
		hideAddressBar: function(retry, maxTries) {
			if(retry >= maxTries) {
				this.resetFixUI();
				return; //avoid a possible loop
			}

			//this.log("hiding address bar");
			if(jq.os.desktop || jq.os.chrome) {
				this.layer.style.height = "100%";
			} else if(jq.os.android) {
				//on some phones its immediate
				window.scrollTo(1, 1);
				this.layer.style.height = this.isFocused_ ? (window.innerHeight) + "px" : (window.outerHeight / window.devicePixelRatio) + 'px';
				//sometimes android devices are stubborn
				that = this;
				//re-test in a bit (some androids (SII, Nexus S, etc) fail to resize on first try)
				var nextTry = retry + 1;
				this.reHideAddressBarTimeout_ = setTimeout(this.retestAndFixUIProxy_, 250 * nextTry, [nextTry, maxTries]); //each fix is progressibily longer (slower phones fix)
			} else if(!this.isFocused_) {
				document.documentElement.style.height = "5000px";
				window.scrollTo(0, 0);
				document.documentElement.style.height = window.innerHeight + "px";
				this.layer.style.height = window.innerHeight + "px";
			}
		},
		getReferenceHeight: function() {
			//the height the page should be at
			if(jq.os.android) {
				return Math.ceil(window.outerHeight / window.devicePixelRatio);
			} else return window.innerHeight;
		},
		getCurrentHeight: function() {
			//the height the page really is at
			if(jq.os.android) {
				return window.innerHeight;
			} else return numOnly(document.documentElement.style.height); //TODO: works well on iPhone, test BB
		},
		onOrientationChange: function(e) {
			//this.log("orientationchange");
			//if a resize already happened, fire the orientationchange
			if(!this.holdingReshapeType_ && this.reshapeTimeout_) {
				this.fireReshapeEvent('orientationchange');
			} else this.previewReshapeEvent('orientationchange');
		},
		onResize: function(e) {
			//avoid infinite loop on iPhone
			if(this.ignoreNextResize_) {
				//this.log('ignored resize');
				this.ignoreNextResize_ = false;
				return;
			}
			//this.logInfo('resize');
			if(this.launchFixUI()) {
				this.reshapeAction();
			}
		},
		onClick: function(e) {
			//handle forms
			var tag = e.target && e.target.tagName != undefined ? e.target.tagName.toLowerCase() : '';

			//this.log("click on "+tag);
			if(inputElements.indexOf(tag) !== -1 && (!this.isFocused_ || !e.target==(this.focusedElement))) {
				var type = e.target && e.target.type != undefined ? e.target.type.toLowerCase() : '';
				var autoBlur = autoBlurInputTypes.indexOf(type) !== -1;

				//focus
				if(!autoBlur) {
					//remove previous blur event if this keeps focus
					if(this.isFocused_) {
						this.focusedElement.removeEventListener('blur', this, false);
					}
					this.focusedElement = e.target;
					this.focusedElement.addEventListener('blur', this, false);
					//android bug workaround for UI
					if(!this.isFocused_ && !this.justBlurred_) {
						//this.log("enter edit mode");
						$.trigger(this, 'enter-edit', [e.target]);
						//fire / preview reshape event
						if($.os.ios) {
							var that = this;
							setTimeout(function() {
								that.fireReshapeEvent('enter-edit');
							}, 300); //TODO: get accurate reading from window scrolling motion and get rid of timeout
						} else this.previewReshapeEvent('enter-edit');
					}
					this.isFocused_ = true;
				} else {
					this.isFocused_ = false;
				}
				this.justBlurred_ = false;
				this.allowDocumentScroll_ = true;

				//fire focus action
				if(requiresJSFocus) {
					e.target.focus();
				}

				//BB10 needs to be preventDefault on touchstart and thus need manual blur on click
			} else if($.os.blackberry10 && this.isFocused_) {
				//this.log("forcing blur on bb10 ");
				this.focusedElement.blur();
			}
		},
		previewReshapeEvent: function(ev) {
			//a reshape event of this type should fire within the next 750 ms, otherwise fire it yourself
			that = this;
			this.reshapeTimeout_ = setTimeout(function() {
				that.fireReshapeEvent(ev);
				that.reshapeTimeout_ = null;
				that.holdingReshapeType_ = null;
			}, 750);
			this.holdingReshapeType_ = ev;
		},
		fireReshapeEvent: function(ev) {
			//this.log(ev?ev+'-reshape':'unknown-reshape');
			$.trigger(this, 'reshape'); //trigger a general reshape notice
			$.trigger(this, ev ? ev + '-reshape' : 'unknown-reshape'); //trigger the specific reshape
		},
		reshapeAction: function() {
			if(this.reshapeTimeout_) {
				//we have a specific reshape event waiting for a reshapeAction, fire it now
				clearTimeout(this.reshapeTimeout_);
				this.fireReshapeEvent(this.holdingReshapeType_);
				this.holdingReshapeType_ = null;
				this.reshapeTimeout_ = null;
			} else this.previewReshapeEvent();
		},
		onFocusIn:function(e){
			if(!this.isFocused_)
				this.onClick(e);
		},
		onBlur: function(e) {
			if(jq.os.android && e.target == window) return; //ignore window blurs
	
			this.isFocused_ = false;
			//just in case...
			if(this.focusedElement) this.focusedElement.removeEventListener('blur', this, false);
			this.focusedElement = null;
			//make sure this blur is not followed by another focus
			this.justBlurred_ = true;
			$.asap(this.exitEditProxy_, this, [e.target]);
		},
		exitExit: function(el) {
			this.justBlurred_ = false;
			if(!this.isFocused_) {
				//this.log("exit edit mode");
				$.trigger(this, 'exit-edit', [el]);
				//do not allow scroll anymore
				this.allowDocumentScroll_ = false;
				//fire / preview reshape event
				if($.os.ios) {
					var that = this;
					setTimeout(function() {
						that.fireReshapeEvent('exit-edit');
					}, 300); //TODO: get accurate reading from window scrolling motion and get rid of timeout
				} else this.previewReshapeEvent('exit-edit');
			}
		},
		onScroll: function(e) {
			//this.log("document scroll detected "+document.body.scrollTop);
			if(!this.allowDocumentScroll_ && !this.isPanning_ && e.target==(document)) {
				this.allowDocumentScroll_ = true;
				if(this.wasPanning_) {
					this.wasPanning_ = false;
					//give it a couple of seconds
					setTimeout(this.launchFixUIProxy_, 2000, [maxHideTries]);
				} else {
					//this.log("scroll forced page into place");
					this.launchFixUI();
				}
			}
		},

		onTouchStart: function(e) {
			//setup initial touch position
			this.dX = e.touches[0].pageX;
			this.dY = e.touches[0].pageY;
			this.lastTimestamp = e.timeStamp;
			this.lastTouchStartX=this.lastTouchStartY=null;


			//check dom if necessary
			if(requirePanning || $.feat.nativeTouchScroll) this.checkDOMTree(e.target, this.layer);
			//scrollend check
			if(this.isScrolling) {
				//remove prev timeout
				if(this.scrollTimeout_ != null) {
					clearTimeout(this.scrollTimeout_);
					this.scrollTimeout_ = null;
					//different element, trigger scrollend anyway
					if(this.scrollTimeoutEl_ != this.scrollingEl_) this.scrollEnded(false);
					else this.blockPossibleClick_ = true;
					//check if event was already set
				} else if(this.scrollTimeoutEl_) {
					//trigger 
					this.scrollEnded(true);
					this.blockPossibleClick_ = true;
				}

			}


			// We allow forcing native tap in android devices (required in special cases)
			var forceNativeTap = (jq.os.android && e && e.target && e.target.getAttribute && e.target.getAttribute("data-touchlayer") == "ignore");

			//if on edit mode, allow all native touches 
			//(BB10 must still be prevented, always clicks even after move)
			if(forceNativeTap || (this.isFocused_ && !$.os.blackberry10)) {
				this.requiresNativeTap = true;
				this.allowDocumentScroll_ = true;

				//some stupid phones require a native tap in order for the native input elements to work
			} else if(inputElementRequiresNativeTap && e.target && e.target.tagName != undefined) {
				var tag = e.target.tagName.toLowerCase();
				if(inputElements.indexOf(tag) !== -1) {
					//notify scrollers (android forms bug), except for selects
					if(tag != 'select') $.trigger(this, 'pre-enter-edit', [e.target]);
					this.requiresNativeTap = true;
				}
			}
			else if(e.target&&e.target.tagName!==undefined&&e.target.tagName.toLowerCase()=="input"&&e.target.type=="range"){
                this.requiresNativeTap=true;
            }

			//prevent default if possible
			if(!this.isPanning_ && !this.requiresNativeTap) {
                if((this.isScrolling && !$.feat.nativeTouchScroll)||(!this.isScrolling))
					e.preventDefault();
				//demand vertical scroll (don't let it pan the page)
			} else if(this.isScrollingVertical_) {
				this.demandVerticalScroll();
			}
		},
		demandVerticalScroll: function() {
			//if at top or bottom adjust scroll
			var atTop = this.scrollingEl_.scrollTop <= 0;
			if(atTop) {
				//this.log("adjusting scrollTop to 1");
				this.scrollingEl_.scrollTop = 1;
			} else {
				var scrollHeight = this.scrollingEl_.scrollTop + this.scrollingEl_.clientHeight;
				var atBottom = scrollHeight >= this.scrollingEl_.scrollHeight;
				if(atBottom) {
					//this.log("adjusting scrollTop to max-1");
					this.scrollingEl_.scrollTop = this.scrollingEl_.scrollHeight - this.scrollingEl_.clientHeight - 1;
				}
			}
		},
		//set rules here to ignore scrolling check on these elements
		//consider forcing user to use scroller object to assess these... might be causing bugs
		ignoreScrolling: function(el) {
			if(el['scrollWidth'] === undefined || el['clientWidth'] === undefined) return true;
			if(el['scrollHeight'] === undefined || el['clientHeight'] === undefined) return true;
			return false;
		},

		allowsVerticalScroll: function(el, styles) {
			var overflowY = styles.overflowY;
			if(overflowY == 'scroll') return true;
			if(overflowY == 'auto' && el['scrollHeight'] > el['clientHeight']) return true;
			return false;
		},
		allowsHorizontalScroll: function(el, styles) {
			var overflowX = styles.overflowX;
			if(overflowX == 'scroll') return true;
			if(overflowX == 'auto' && el['scrollWidth'] > el['clientWidth']) return true;
			return false;
		},


		//check if pan or native scroll is possible
		checkDOMTree: function(el, parentTarget) {

			//check panning
			//temporarily disabled for android - click vs panning issues
			if(requirePanning && this.panElementId == el.id) {
				this.isPanning_ = true;
				return;
			}
			//check native scroll
			if($.feat.nativeTouchScroll) {

				//prevent errors
				if(this.ignoreScrolling(el)) {
					return;
				}

				//check if vertical or hor scroll are allowed
				var styles = window.getComputedStyle(el);
				if(this.allowsVerticalScroll(el, styles)) {
					this.isScrollingVertical_ = true;
					this.scrollingEl_ = el;
					this.isScrolling = true;
					return;
				} else if(this.allowsHorizontalScroll(el, styles)) {
					this.isScrollingVertical_ = false;
					this.scrollingEl_ = null;
					this.isScrolling = true;
				}

			}
			//check recursive up to top element
			var isTarget = el==(parentTarget);
			if(!isTarget && el.parentNode) this.checkDOMTree(el.parentNode, parentTarget);
		},
		//scroll finish detectors
		scrollEnded: function(e) {
			//this.log("scrollEnded");
			if(e) this.scrollTimeoutEl_.removeEventListener('scroll', this.scrollEndedProxy_, false);
			this.fireEvent('UIEvents', 'scrollend', this.scrollTimeoutEl_, false, false);
			this.scrollTimeoutEl_ = null;
		},


		onTouchMove: function(e) {
			//set it as moved
			var wasMoving = this.moved;
			this.moved = true;
			//very sensitive devices check
			if(verySensitiveTouch) {
				this.cY = e.touches[0].pageY - this.dY;
				this.cX = e.touches[0].pageX - this.dX;
			}
			//panning check
			if(this.isPanning_) {
				return;
			}
			//native scroll (for scrollend)
			if(this.isScrolling) {

				if(!wasMoving) {
					//this.log("scrollstart");
					this.fireEvent('UIEvents', 'scrollstart', this.scrollingEl_, false, false);
				}
				//if(this.isScrollingVertical_) {
					this.speedY = (this.lastY - e.touches[0].pageY) / (e.timeStamp - this.lastTimestamp);
					this.lastY = e.touches[0].pageY;
					this.lastX = e.touches[0].pageX;
					this.lastTimestamp = e.timeStamp;
				//}
			}
			//non-native scroll devices

			if((!$.os.blackberry10 && !this.requiresNativeTap)) {
				//legacy stuff for old browsers
				if(!this.isScrolling ||!$.feat.nativeTouchScroll)
					e.preventDefault();
				return;
			}
			e.stopPropagation();
		},

		onTouchEnd: function(e) {
			if($.os.ios){
				if(skipTouchEnd==e.changedTouches[0].identifier){
					e.preventDefault();
					return false;
				}
				skipTouchEnd=e.changedTouches[0].identifier;
			}
			//double check moved for sensitive devices
			var itMoved = this.moved;
			if(verySensitiveTouch) {
				itMoved = itMoved && !(Math.abs(this.cX) < 10 && Math.abs(this.cY) < 10);
			}

			//don't allow document scroll unless a specific click demands it further ahead
			if(!jq.os.ios || !this.requiresNativeTap) this.allowDocumentScroll_ = false;

			//panning action
			if(this.isPanning_ && itMoved) {
				//wait 2 secs and cancel
				this.wasPanning_ = true;

				//a generated click
			} else if(!itMoved && !this.requiresNativeTap) {

				//NOTE: on android if touchstart is not preventDefault(), click will fire even if touchend is prevented
				//this is one of the reasons why scrolling and panning can not be nice and native like on iPhone
				e.preventDefault();

				//fire click
				if(!this.blockClicks && !this.blockPossibleClick_) {
					var theTarget = e.target;
					if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
					this.fireEvent('Event', 'click', theTarget, true, e.mouseToTouch,e.changedTouches[0]);
					this.lastTouchStartX=this.dX;
					this.lastTouchStartY=this.dY;
				}

			} else if(itMoved) {
				//setup scrollend stuff
				if(this.isScrolling) {
					this.scrollTimeoutEl_ = this.scrollingEl_;
					if(Math.abs(this.speedY) < 0.01) {
						//fire scrollend immediatly
						//this.log(" scrollend immediately "+this.speedY);
						this.scrollEnded(false);
					} else {
						//wait for scroll event
						//this.log($.debug.since()+" setting scroll timeout "+this.speedY);
						this.scrollTimeout_ = setTimeout(this.scrollTimeoutExpireProxy_, 30)
					}
				}
				//trigger cancel-enter-edit on inputs
				if(this.requiresNativeTap) {
					if(!this.isFocused_) $.trigger(this, 'cancel-enter-edit', [e.target]);
				}
			}
			this.clearTouchVars();
		},

		clearTouchVars: function() {
			//this.log("clearing touchVars");
			this.speedY = this.lastY = this.cY = this.cX = this.dX = this.dY = 0;
			this.moved = false;
			this.isPanning_ = false;
			this.isScrolling = false;
			this.isScrollingVertical_ = false;
			this.requiresNativeTap = false;
			this.blockPossibleClick_ = false;
		},

		fireEvent: function(eventType, eventName, target, bubbles, mouseToTouch,data) {
			//this.log("Firing event "+eventName);
			//create the event and set the options
			var theEvent = document.createEvent(eventType);
			theEvent.initEvent(eventName, bubbles, true);
			theEvent.target = target;
            if(data){
                $.each(data,function(key,val){
                    theEvent[key]=val;
                });
            }
			//jq.DesktopBrowsers flag
			if(mouseToTouch) theEvent.mouseToTouch = true;
			target.dispatchEvent(theEvent);
		}
	};

})();
(function($ui){

  function popTransition(old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this
    if (back) {
      current_div.style.zIndex = 1;
      old_div.style.zIndex = 2;
      that.clearAnimations(current_div);
      that.css3animate(old_div, {
        x: "0%",
        time: "150ms",
        opacity: .1,
        scale: .2,
        origin: "-50%"+" 50%",
        complete: function(canceled) {
          if(canceled) {
            that.finishTransition(old_div);
            return;
          }

          that.css3animate(old_div, {
            x: "-100%",
            complete: function() {
              that.finishTransition(old_div);
            }
          });
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      old_div.style.zIndex = 1;
      current_div.style.zIndex = 2;
      that.css3animate(current_div, {
        x: "0%",
        y: "0%",
        scale: .2,
        origin: "-50%"+" 50%",
        opacity: .1,
        complete: function() {
          that.css3animate(current_div, {
            x: "0%",
            time: "150ms",
            scale: 1,
            opacity: 1,
            origin: "0%"+" 0%",
            complete: function(canceled){
              if(canceled) {
                that.finishTransition(old_div, current_div);
                return;
              }

              that.clearAnimations(current_div);
              that.css3animate(old_div, {
                x: "100%",
                y: 0,
                complete: function() {
                  that.finishTransition(old_div);
                }
              });
            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.pop = popTransition;
})($.ui);

(function($ui){

  function slideDownTransition (old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this
    if (back) {
      current_div.style.zIndex = 1;
      old_div.style.zIndex = 2;
      that.clearAnimations(current_div);
      that.css3animate(old_div, {
        y: "-100%",
        x: "0%",
        time: "150ms",
        complete: function(canceled) {
          if(canceled) {
            that.finishTransition(old_div, current_div);
            return;
          }

          that.css3animate(old_div, {
            x: "-100%",
            y: 0,
            complete: function() {
              that.finishTransition(old_div);

            }
          });
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      old_div.style.zIndex = 1;
      current_div.style.zIndex = 2;
      that.css3animate(current_div, {
        y: "-100%",
        x: "0%",
        complete: function() {
          that.css3animate(current_div, {
            y: "0%",
            x: "0%",
            time: "150ms",
            complete: function(canceled){
              if(canceled) {
                that.finishTransition(old_div, current_div);
                return;
              }

              that.clearAnimations(current_div);
              that.css3animate(old_div, {
                x: "-100%",
                y: 0,
                complete: function() {
                  that.finishTransition(old_div);
                }
              });

            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.down = slideDownTransition;
})($.ui);


(function($ui){

  /**
   * Initiate a sliding transition.  This is a sample to show how transitions are implemented.  These are registered in $ui.availableTransitions and take in three parameters.
   * @param {Object} previous panel
   * @param {Object} current panel
   * @param {Boolean} go back
   * @title $ui.slideTransition(previousPanel,currentPanel,go_back);
   */
  function slideTransition(old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this;
    if (back) {
      that.css3animate(old_div, {
        x:"0%",
        y:"0%",
        complete:function(){
          that.css3animate(old_div, {
            x: "100%",
            time: "150ms",
            complete: function() {
              that.finishTransition(old_div, current_div);
            }
          }).link(current_div, {
                x: "0%",
                time: "150ms"
              });
        }
      }).link(current_div, {
            x:"-100%",
            y:"0%"
          });
    } else {
      that.css3animate(old_div, {
        x:"0%",
        y:"0%",
        complete:function(){
          that.css3animate(old_div, {
            x: "-100%",
            time: "150ms",
            complete: function() {
              that.finishTransition(old_div, current_div);
            }
          }).link(current_div, {
                x: "0%",
                time: "150ms"
              });
        }
      }).link(current_div, {
            x:"100%",
            y:"0%"
          });
    }
  }
  $ui.availableTransitions.slide = slideTransition;
  $ui.availableTransitions['default'] = slideTransition;
})($.ui);

(function($ui){

  function slideUpTransition(old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this;
    if (back) {
      current_div.style.zIndex = 1;
      old_div.style.zIndex = 2;

      that.clearAnimations(current_div);

      that.css3animate(old_div, {
        y: "100%",
        x: "0%",
        time: "150ms",
        complete: function() {
          that.finishTransition(old_div);
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      current_div.style.zIndex = 2;
      old_div.style.zIndex = 1;
      that.css3animate(current_div, {
        y: "100%",
        x: "0%",
        complete: function() {
          that.css3animate(current_div, {
            y: "0%",
            x: "0%",
            time: "150ms",
            complete: function(canceled) {
              if(canceled) {
                that.finishTransition(old_div, current_div);
                return;
              }

              that.clearAnimations(current_div);
              that.css3animate(old_div, {
                x: "-100%",
                y: 0,
                complete: function() {
                  that.finishTransition(old_div);
                }
              });

            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.up = slideUpTransition;
})($.ui);


(function($ui){

  function fadeTransition (old_div, current_div, back) {
    old_div.style.display = "block";
    current_div.style.display = "block";
    var that = this;
    if (back) {
      current_div.style.zIndex = 1;
      old_div.style.zIndex = 2;
      that.clearAnimations(current_div);
      that.css3animate(old_div, {
        x: "0%",
        time: "150ms",
        opacity: .1,
        complete: function(canceled) {
          if(canceled) {
            that.finishTransition(old_div, current_div);
            return;
          }

          that.css3animate(old_div, {
            x: "-100%",
            opacity: 1,
            complete: function() {
              that.finishTransition(old_div);
            }

          });
          current_div.style.zIndex = 2;
          old_div.style.zIndex = 1;
        }
      });
    } else {
      old_div.style.zIndex = 1;
      current_div.style.zIndex = 2;
      current_div.style.opacity = 0;
      that.css3animate(current_div, {
        x: "0%",
        opacity: .1,
        complete: function() {
          that.css3animate(current_div, {
            x: "0%",
            time: "150ms",
            opacity: 1,
            complete:function(canceled){
              if(canceled) {
                that.finishTransition(old_div, current_div);
                return;
              }

              that.clearAnimations(current_div);
              that.css3animate(old_div, {
                x: "-100%",
                y: 0,
                complete: function() {
                  that.finishTransition(old_div);
                }
              });
            }
          });
        }
      });
    }
  }
  $ui.availableTransitions.fade = fadeTransition;
})($.ui);

// @author Ian Maffett
// @copywrite AppMobi 2012
// Please see - https://developers.google.com/maps/documentation/javascript/ for the API


/**
 * jq.maps.js - google maps plugin wrapper for jqMobi apps.  You can pass in configuration options that are from the Google Maps API
   ```
   $("#map").gmaps({zoom: 8,center: new google.maps.LatLng(40.010787, -76.278076),mapTypeId: google.maps.MapTypeId.ROADMAP});   // create the map with basic options
   $("#map").gmaps() //return the google maps object back from cache
   ```
   *@param {Object} [options]
   *@title $().gmaps([options]);
   */
(function () {
    var gmapsLoaded = false;
    $(document).ready(function () {
        if(window['google']&&google.maps){
            $(document).trigger("gmaps:available");
            gmapsLoaded = true;
            return true;
        }
        var gmaps = document.createElement("script");
        gmaps.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyC-weGLF_U2fkiHZ4vwT_sL7KXsXqaxrl0&sensor=true&callback=gmapsPluginLoaded";
        $("head").append(gmaps);
        window['gmapsPluginLoaded'] = function () {
            $(document).trigger("gmaps:available");
            gmapsLoaded = true;
        }
    });

    var mapsCache = {};

    $.fn.gmaps = function (options) {
      0;
        if (this.length == 0) {
          0
          return;
        }
        if (!options) {
          0;
          return mapsCache[this[0].id];
        }
        if(options=="resize"&&mapsCache[this[0].id])
        {
          0;
           return google.maps.event.trigger(mapsCache[this[0].id], 'resize');
        }
        for (var i = 0; i < this.length; i++) {
          0;
            new gmaps(this[i], options);
        }
    };


    
    var gmaps = function (elem, options) {
        var createMap = function () {
          0;
            if (!options || Object.keys(options).length == 0) {
              0;
                options = {
                    zoom: 8,
                    center: new google.maps.LatLng(40.010787, -76.278076),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
            }
            mapsCache[elem.id] = new google.maps.Map(elem, options);
            google.maps.event.trigger(mapsCache[elem.id], 'resize');
        };

        if (!gmapsLoaded) {
            $(document).one("gmaps:available", function () {
                0;
                createMap();
            });
        } else {
          0;
            createMap();
        }
    }
})(jq);
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

      0;

        //Redo this. Error appears when nodeName doesnt exist
        if (typeof (url) !== "string" && url.nodeName && url.nodeName.toLowerCase() === "a") {
            0;
            url = url.href;
        }
        if (typeof (url) !== "string") {
          0;
            throw "Invalid route parameter.  String or <a> expected";
        }
        var route, axt;

        var origUrl = url;
        if (url.indexOf(baseUrl) === 0) { url = url.substring(baseUrl.length, url.length); }
        if (url[0] === "/") { url = url.substr(1); }
        if (url[url.length - 1] === "/") { url = url.slice(0, -1); }
        url = url.split("/");

        if (url.length > 1) {
          0;
            route = url.splice(0, 1);
            axt = url.splice(0, 1);
        } else {
          0;
            route = url[0];
            axt = "default";
        }
        0;
        0;
        if ($.mvc.controller[route] && $.mvc.controller[route].hasOwnProperty(axt)) {

          0;
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
        0;
        0;
      debugger;
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



//models.js

(function ($) {


    $.mvc.model = function (name, options) {
        var new_model = {};
        options && options.modelName && delete options.modelName;      //If there is a model name, delete it
        options && options.id && delete options.id;                    //If there is a model id, delete it
        $.extend(new_model, options);                                  //Extends the object with additional arguments
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




//controllers.js

(function ($) {

    var viewsCache = [], modelsCache = [], readyFuncs = {}, viewsTotal = {}, modelsTotal = {},
        viewsLoaded = {}, modelsLoaded = {}, controllerReady = {};

    //Create a new controller
    $.mvc.controller = {};

    //We will add each controller given to the $mvc.controller object
    $.mvc.controller.create = function (name, controller) {
      0;
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

        return $.mvc.controller[name];

    };

})(jq);




var chat_log = {
  "chat_info": {
    "chat_id": "23213123",
    "my_photo": "photo_url_on_phone",
    "other_photo": "photo_url",
    "other_name": "Bob"
  },
  "messages": [

    {
      "id": "0",
      "user": "Bob",
      "text": "hello there",
      "time": "04:41"
    },
    {
      "id": "1",
      "user": "Sam",
      "text": "hey whats up",
      "time": "04:41"
    },
    {
      "id": "2",
      "user": "Bob",
      "text": "nothing much",
      "time": "04:41"
    },
    {
      "id": "3",
      "user": "Bob",
      "text": "what u doing",
      "time": "04:41"
    }
  ]
};
var Chat = new $.mvc.model.Extend("chat", {
  chat_id: '',
  current_chat: this,                                        //might be wrong
  my_photo: function () {
    return current_user.profile_pic;                          //this might keep getting executed multiple times
  },
  latest_sent_message_timestamp: '',
  latest_received_message_timestamp: '',
  messages: [],
  poll_for_messages: function () {
    var data = {
      chat_id: this.chat_id,
      timestamp: this.latest_received_message_timestamp,
      total_messages: this.messages.length(),
      token: current_user.token
    };


    $.post(server + "chat", data,
        function (response) {
          current_chat.push.apply(current_chat.messages, response.messages);     //5x faster than looping
          //a.push.apply(a, b);    -> this seems more readable
        },
        "json");


    //every 10 seconds send latest received message timestamp
    //server responds with an array of newer messages
    // messages.push(new_message)    ->this is correct way of doing it
    //add latest timestamp to this.latest_timestamp
    //this.update
  },
  send_message: function (messages) {
    //add to local and send to remote
    $.ajax({
      url: server + "/users/auth",
      data: message,
      success: function (response) {
        //sent date time should display
      },
      error: function (response) {
        //message sending... should display. -> that should be default and it should keep it
      }
    });

    $.ajax({
      type: 'POST',
      url: server + 'chat',
      contentType: 'application/json',
      headers: { TOKEN: current_user.token },
      dataType: 'application/json',
      data: { message: messages }, //Can be Key/Value, string, or object. $.serialize called if object
      success: function (response) {
        //sent date time should display
      },
      error: function (response) {
        //message sending should continue to be displayed. retry sending every 5 seconds
      }

    });

    //add to local_storage

  },                                                              //post & update timestamp
  update: function (new_messages) {
    //Adds new messages to display window via $()
    //runs a template that only has the 2 chat of left and right and appends it to the end
  }
//    ,
//    refresh: function(){
//
//    }
});

//Instance definitions

var chat_room = {};

//Clicking chat with someone:

//Make the template first which will hold all of the functions

//First check localstorage to see if we have a chat with them
//Chat with one person saved to their userid locally
//Do a chat.userid.poll_for_messages

//
Person = new $.mvc.model.Extend('person', {

});

//Instance definitions

var people = {};
Photo = new $.mvc.model.Extend('photo', {

});

//Instance definitions

var photos = {};
Place = new $.mvc.model.Extend('place', {

});

//Instance definitions

var places = {};
var User = new $.mvc.model.Extend('user', {                                 //Instances defined at the bottom
  name: '',
  email: '',
  token: '',
  profile_pic: '',

  save: function () {
    window.localStorage.setItem('current_user', JSON.stringify(this));
    //TODO post to server as well?
  },

  //Load a user from local storage
  load_local_data: function () {
    try {
      var saved_user = JSON.parse(window.localStorage.getItem('current_user'));
      if (saved_user.token.length > 5) {
        current_user.name = saved_user.name;
        current_user.email = saved_user.email;
        current_user.token = saved_user.token;
      }
    } catch (e) {
      current_user.token = 'guest';
    }
  },
  logout: function () {
    //TODO post to server to clear token
    window.localStorage.clear();
  }
});

//instance definitions
var current_user = new User();
0;

/*global alert: false, confirm: false, console: false, $: false */

var chat_log = {
  "chat_info": {
    "chat_id": "23213123",
    "my_photo": "photo_url_on_phone",
    "person2_photo": "photo_url",
    "person2": "Bob"
  },
  "messages": [  //server should make sure these messages are aligned in right order

    {
      "timestamp": "0",
      "user": "Bob",
      "text": "hello there"
    },
    {
      "timestamp": "1",
      "user": "Sam",
      "text": "hey whats up"
    },
    {
      "timestamp": "2",
      "user": "Bob",
      "text": "nothing much"
    },
    {
      "timestamp": "3",
      "user": "Bob",
      "text": "what u doing"
    }
  ]
};

$.mvc.controller.create('chats_controller', {

  init: function () {


  },

  //display all previous chats
  default: function () {                                                                                                          //get the local chat data
    chat_room.room_list = JSON.parse(window.localStorage.getItem('chat_room_list'));

    $.ui.show_page({
      div_id: 'chat_index_view',
      title: 'Chats',
      header: '#header',
      left_button: '#top_back_button',
      right_button: '#top_new_chat_button',
      footer: '#footer',
      active_footer_button: '#bottom_nav_home',
      api_url: '/chats/',
      data: chat_room.room_list
    });

  },

  detail: function (chat_id, action, user_id) {


    $.ui.show_page({
      div_id: 'chat_detail_view',
      title: 'Chat Detail',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#chat_footer',
      active_footer_button: false,
      api_url: '/chats/',
      data: chat_id                   //probably not right
    });

    $('#chat_submit').bind('click', function () {
      chat_id.send_message();
    });

    //Need to do something better than this here. Everything below this line is bad
    //-------------------------------
//
//    if (JSON.parse(window.localStorage.getItem('chat_' + user_id))) {                                                       //see if we have saved chatroom data
//      chat_room[user_id] = JSON.parse(window.localStorage.getItem('chat_' + user_id));
//      console.log('a chatroom was found');
//    } else {                                                  //if not, lets make a new chatroom
//      chat_room[user_id] = new Chat();
//      console.log("just made a new chat cause an old one wasn't found");
//    }

    //chat_room[user_id].refresh();       //this needs to be implemented

    //todo
    //send the latest message_id (#embeds_many message) to the server via getJSON
    //It will return only the newest messages which should be appended to the older.


    //If the person clicked to send a message...
//    if (action === 'send') {
//
//    }

  },

  sent: function () {

    $.ui.show_page({
      div_id: 'chat_sent_view',
      title: 'Chats',
      header: '#header',
      left_button: '#top_back_button',
      right_button: '#top_new_chat_button',
      footer: '#footer',
      active_footer_button: '#bottom_nav_home',
      api_url: '/chats/sent',
      data: false
    });

  },

  new: function () {

    $.ui.show_page({
      div_id: 'chat_new_view',
      title: 'New Chat',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_home',
      api_url: false,
      data: false
    });
  }
});


/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('people_controller', {

  init: function () {


  },

  default: function () {
    $.ui.show_page({
      div_id: 'people_index_view',
      title: 'Following',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: false,
      data: false
    });

  },

  followers: function () {
    $.ui.show_page({
      div_id: 'people_followers_view',
      title: 'Followers',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: false,
      data: false
    });

  },

  nearby: function () {

    $.ui.show_page({
      div_id: 'people_nearby_view',
      title: 'People Nearby',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: /users/,
      data: false
    });

/*
    $.ajax({
      type: 'GET',
      url: server + '/users/',
      dataType: 'application/json',
      headers: { TOKEN: current_user.token },

      success: function (response, statusText, xhr) {
        var data = JSON.parse(response);
        //If view doesn't exist, make one
        if ($('#people_nearby_view').length == 0) {
          console.log('creating for the first time');
          $.ui.add_content_div('people_nearby_view',
              $.template('views/people/people_nearby_view.js', data), 'People Nearby View');
        }
        else {
          console.log('updating') ;
          //otherwise, update the content inside
          $.ui.update_content_div('people_nearby_view', $.template('views/people/people_nearby_view.js', data));
        }
        //show the view
        $.ui.load_content('people_nearby_view', false, false, 'fade');
      },

      error: function () {

      }
    });
    
    */
  },

  detail: function (user_id) {

    $.ui.show_page({
      div_id: 'people_detail_view',
      title: 'People',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_people',
      api_url: false,
      data: false
    });

  }
});


/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('photos_controller', {
  init: function () {


  },

  default: function () {

    $.ui.show_page({
      div_id: 'photos_index_view',
      title: 'Photos',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_photos',
      api_url: false,
      data: false
    });

  },

  detail: function (photo_id, comment) {

    $.ui.show_page({
      div_id: 'photo_detail_view',
      title: 'Photo',
      header: '#header',
      left_button: '#top_back_button',
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_photos',
      api_url: false,
      data: false
    });

  },

  take_photo: function() {
    if(typeof forge === 'undefined'){
      alert('Only works on phones');
    }
    else {
      forge.file.getImage();
    }

  }
});


/*global alert: false, confirm: false, console: false, $: false */

$.mvc.controller.create('places_controller', {

  init: function () {


  },

  default: function () {

    $.ui.show_page({
      div_id: 'places_index_view',
      title: 'Places',
      header: '#header',
      left_button: false,
      right_button: false,
      footer: '#footer',
      active_footer_button: '#bottom_nav_places',
      api_url: false,
      data: false
    });

    $('#places_index_view').gmaps({
      center: new google.maps.LatLng(37.76, -122.43),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

  }


});


/*global alert: false, confirm: false, console: false, $: false */
0;
$.mvc.controller.create('users_controller', {
  init: function () {
  0;

  },


  default: function () {
    0;
    $.ui.show_page({
       div_id: 'user_index_view',
       title: 'FunLife',
       header: '#header',
       left_button: false,
       right_button: '#top_logout_button',
       footer: '#footer',
       active_footer_button: '#bottom_nav_home',
       api_url: '/users/',
       data: false
    });

  },

  login_register: function (action) {

   //remove a 'wrong password' error if shown from previous try
    $('#login_error').hide();


    switch (action) {
    case undefined:
      current_user.token = 'guest';
      $.ui.show_page({
        div_id: 'user_login_register_view',
        title: false,
        header: false,
        left_button: false,
        right_button: false,
        footer: false,
        active_footer_button: false,
        api_url: false,
        data: false
      });
      break;

    case 'login':


      $.ajax({
        type: 'POST',
        dataType: 'application/json',
        url: server+'/sessions/',
        data: $('#login_form').serialize(),
        success: function (response, statusText, xhr) {
          current_user.token = 'Basic ' + Base64.encode(JSON.parse(response).user.token);
          current_user.save();
          $.mvc.route('/users_controller/');
        },
        error: function (xhr, error ){
          if (xhr.status === 401) {
            $('#login_error').html('Wrong Password').show();
          }
          else {
            $('#login_error').html('Connection error...').show();
          }
        }
      });
      break;

    case 'register':

      $.ajax({
        type: 'POST',
        dataType: 'application/json',
        data: $('#login_form').serialize(),
        url: server+'/users/',
        success: function (response, success, xhr) {
          current_user.token = 'Basic ' + Base64.encode(JSON.parse(response).user.token);
          current_user.save();
          $.mvc.route('/users_controller/register2');
        },
        error: function(xhr, error ){
          if (xhr.status === 422) {
            $('#login_error').html('An account with that email already exists. Login instead?').show();
          }
          else {
            $('#login_error').html('Connection error...').show();
          }
        }
      });
      break;
    }
  },

  register2: function (action) {
    switch (action) {
      case undefined:
        $.ui.show_page({
          title: 'Complete Your Registration',
          active_nav: false,
          div_id: 'user_register2_view',
          left_button: false,
          api_url: false,
          data: false
        });
        break;

      case 'complete':
        $.put_with_token({
          api_url: '/users/',
          data: $('#registration_details_form').serialize(),
          success: function () {
            $.mvc.route('/users_controller/');
            $('#footer').show();
          },
          error: function () {
            //TODO Make this show connection error
          }
        });
        break;
    }

  },

  logout: function () {
    current_user.logout();
    $.mvc.route('/users_controller/login_register');
  }


});


function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};}
String.prototype.encodeHTML=encodeHTMLSource();
var tmpl=tmpl|| {};
 tmpl.activity_detail_attending_view=function anonymous(it) {
var out='';return out;
};
 tmpl.activity_detail_info_view=function anonymous(it) {
var out='';return out;
};
 tmpl.activity_detail_join_view=function anonymous(it) {
var out='';return out;
};
 tmpl.chat_detail_view=function anonymous(it) {
var out='<br><!--';var arr1=it.chat_log;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='Chatting with '+(value.chat_info.person2);if(value.messages.name === current_user.name){out+='<div class=\'chat_message_left\'><div class=\'userimg\' style=\'background-image:url('+(value.userimg)+');\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p></div></div>';}else if(value.level != true){out+='<div class=\'chat_message_right\'><div class=\'userimg\' style=\'background-image: url('+(value.userimg)+')\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p></div></div>';}} } out+='--><div class="row-fluid"><div class="span2"><img class="img-polaroid" src="/photos/7.png"></div><div class="span9 offset1 well well-small"><small class="muted">7:10pm</small><p> Hello Bob! How are you doing? </p></div></div><div class="row-fluid"><div class="span9 well well-small"><small class="muted">7:12pm</small><p>I\'m doing good how are you?</p></div><div class="span2"><img class="img-polaroid" src="/photos/5.png"></div></div>';return out;
};
 tmpl.chat_index_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span6 btn text-info" href=\'/chats_controller/\'>Recieved</a><a class="span6 btn" href=\'/chats_controller/sent/\'>Sent</a></div><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Kimberly Rose</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a>';return out;
};
 tmpl.chat_list_view=function anonymous(it) {
var out='All your chats:<table><tr><td>Email</td><td>Name</td><td>Chat</td><tr>';var arr1=it.chat_list;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<tr><td>'+(value.email)+'</td><td>'+(value.name)+'</td><td><a href="/chats_controller/chat/'+(value.user_id)+'">View</a></td></tr>';} } out+='</table>';return out;
};
 tmpl.chat_new_view=function anonymous(it) {
var out='chats_new_view';return out;
};
 tmpl.chat_sent_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span6 btn" href=\'/chats_controller/\'>Recieved</a><a class="span6 btn text-info" href=\'/chats_controller/sent/\'>Sent</a></div><a href=\'/chats_controller/detail/blah\'><div class=\'row-fluid well well-small\'><div class=\'span2\'><img src="/photos/3.png"></div><div class=\'span7 offset1\'><span class=\'text-info\'>Billy Bob</span><br><small>Dec 17, 11:20pm</small></div><div class=\'span2\'><i class="icon-forward"></i></div></div></a>';return out;
};
 tmpl._comments=function anonymous(it) {
var out='Hello, I am on the _comments.js partial view <br><a href="/hello">Go Back</a>';var arr1=it.comments;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];if(value.level == 1){out+='<div class=\'commentLevel1\'><div class=\'userimg\' style=\'background-image:url('+(value.userimg)+');\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p><a class=\'button\' href=\'#reply\'>Reply</a></div></div>';}else if(value.level == 2){out+='<div class=\'commentLevel2\'><div class=\'userimg\' style=\'background-image: url('+(value.userimg)+')\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p><a class=\'button\' href=\'#reply\'>Reply</a></div></div>';}else{out+='<div class=\'commentLevel3\'><div class=\'userimg\' style=\'background-image: url('+(value.userimg)+')\'></div><div class=\'usercomment\'><span class=\'username\'>'+(value.name)+'</span><span class=\'commentTime\'>'+(value.time)+'</span><p class=\'commentContent\'>'+(value.comment)+'</p><a class=\'button\' href=\'#reply\'>Reply</a></div></div>';}} } return out;
};
 tmpl.people_detail_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn text-info" href=\'/people_controller/profile\'>Profile</a><a class="span4 btn" href=\'/people_controller/profile/comments\'>Comments</a><a class="span4 btn" href=\'/people_controller/profile/photos\'>Photos</a></div><br><div class=\'row-fluid\'><div class=\'span3\'><img class=\'img-polaroid\' src="/layout/img/user_placeholder.jpeg"></div><div class=\'span8 offset1\'><div class=\'row-fluid lead\'>FirstName LastName</div><div class=\'row-fluid text-center\'><ul class="nav nav-pills"><li class="active"><a>344<br><small>Followers</small></a></li><li class="active"><a>423<br><small>Following</small></a></li><li class="active"><a>&nbsp<br><small>Status</small></a></li></ul></div></div></div><div class=\'row-fluid\'><div class=\'span2\'><button class="btn btn-large btn-success disabled">7 Trust</button></div><div class=\'span3 offset2\'><a href=\'#\' class=\'btn btn-small btn-info btn-block\'>Trust</a><a href=\'/chats_controller/detail/chatid/new/userid\' class=\'btn btn-small btn-info btn-block\'>Chat</a></div><div class=\'span3 offset1\'><a href=\'#\' class=\'btn btn-small btn-info btn-block\'>Follow</a><a href=\'#\' class=\'btn btn-small btn-info btn-block\'>Invite</a></div></div><br><div class=\'row-fluid text-center label label-info\'>Feedback Score: 83</div><br><div class=\'row-fluid label\'>Activities I want to be invited to</div><div class=\'row-fluid\'>todo</div><br><div class=\'row-fluid label\'>Activities completed</div>';return out;
};
 tmpl.people_followers_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn" href=\'/people_controller/\'>Following</a><a class="span4 btn text-info" href=\'/people_controller/followers/\'>Followers</a><a class="span4 btn" href=\'/people_controller/nearby/\'>Nearby</a></div>';return out;
};
 tmpl.people_index_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn text-info" href=\'/people_controller/\'>Following</a><a class="span4 btn" href=\'/people_controller/followers/\'>Followers</a><a class="span4 btn" href=\'/people_controller/nearby/\'>Nearby</a></div><br><br><br><br><br><a href=\'http:<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index viewvvvv<br><br><br><br><br>People index view<br><br><br><br><br>People index viewvvvvv<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index view<br><br><br><br><br>People index viewvvv<br><br><br><br><br>People index view';return out;
};
 tmpl.people_nearby_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn" href=\'/people_controller/\'>Following</a><a class="span4 btn" href=\'/people_controller/followers/\'>Followers</a><a class="span4 btn text-info" href=\'/people_controller/nearby/\'>Nearby</a></div>';var arr1=it.users;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];if(index != 0 && index % 4 === 0){out+='</ul></div>';}if(index % 4 === 0){out+='<div class="row-fluid"><ul class="thumbnails">';}out+='<li class="span3"><a id="chat_'+(value.user_id)+'" href="/people_controller/detail/'+(value.user_id)+'" class="thumbnail"><img src="/layout/img/user_placeholder.jpeg">'+(value.name)+'</a></li>';} } out+='</ul></div>';return out;
};
 tmpl.photo_detail_view=function anonymous(it) {
var out='<div class=\'row-fluid\'><div class=\'span2\'><img src="/photos/7.png"></div><div class=\'span6\'>Larissa Jane</div><div class=\'span1\'><img src=\'layout/img/icons/comment_bubble.png\'></div><div class=\'span1\'><img src=\'layout/img/icons/photo_likes.png\'></div></div><div class=\'row-fluid\'><div class=\'span10 offset1\'><img src=\'/photos/7.png\'></div></div><div class=\'row-fluid\'><div class=\'span10\'>Nashville Concert Hall, Nashville</div><div class=\'span2\'><a href=\'/photos_controller/detail/photo_id/comment/\' class=\'btn btn-small\'>Comment</a></div></div>';return out;
};
 tmpl.photos_index_view=function anonymous(it) {
var out='<div class="row-fluid btn-group"><a class="span4 btn text-info" href=\'/photos_controller/\'>Following</a><a class="span4 btn" href=\'/photos_controller/explore/\'>Explore</a><a class="span4 btn" href=\'/photos_controller/my_photos/\'>My Photos</a></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="/photos_controller/detail/photo_id/" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div><div class="row-fluid"><ul class="thumbnails"><li class="span4"><a href="#" class="thumbnail"><img src="/photos/7.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/2.png"></a></li><li class="span4"><a href="#" class="thumbnail"><img src="/photos/11.png"></a></li></ul></div>';return out;
};
 tmpl.places_index_view=function anonymous(it) {
var out='';return out;
};
 tmpl.user_index_view=function anonymous(it) {
var out='<ul class="breadcrumb"><li>My Activities</li></ul><div class="row-fluid"><ul class="thumbnails"><li class="span3 text-center"><a href="/activity_controller/new" class="thumbnail no_borders"><img src="/layout/img/create_activity.png"></a></li><li class="span3 text-center"><a href="/chats_controller/" class="thumbnail no_borders"><img src="/layout/img/chats.png"></a></li><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/soccer.png"><small>Today<br>4:30pm</small></a></li><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/cards.png"><small>Wednesday 11/24<br>9:30pm</small></a></li></ul></div><ul class="breadcrumb"><li>Today\'s Activities</li></ul><div class="row-fluid"><ul class="thumbnails"><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/pool.png"><small>2.1 mi<br>7:30pm</small></a></li><li class="span3 text-center"><a href="#" class="thumbnail no_borders"><img src="/layout/img/basketball.png"><small>3.7 mi<br>8:30pm</small></a></li></ul></div><ul class="breadcrumb"><li>Tomorrow\'s Activities</li></ul>';return out;
};
 tmpl.user_login_register_view=function anonymous(it) {
var out='<div><div class="row-fluid text-center"><br><br><h1>FunLife</h1><br><div id="login_error" class="alert"></div><br><br><div id="login_holder"><form id="login_form"><input id=\'#login_form_email_field\' type="text" name="user[email]" placeholder="email"><br><input id=\'#login_form_password_field\' type="text" name="user[password]" placeholder="password"></form><ul class="pager"><li><a href="/users_controller/login_register/register">Register</a></li><li><a href="/users_controller/login_register/login">Login</a></li></ul></div></div></div>';return out;
};
 tmpl.user_register2_view=function anonymous(it) {
var out='<div class="container-fluid"><div class="row-fluid text-center"><br><br><h3>Tell us a little about yourself:</h3><br><div id="registration_details"><form id="registration_details_form"><input type="text" name="user[first_name]"  placeholder="first name"><input type="text" name="user[last_name]" placeholder="last name"></form><a href="/users_controller/register2/complete" class="btn btn-success">Complete Registration</a></div></div></div>';return out;
};

if (typeof forge === 'undefined' && typeof device === 'undefined') {
  //if not running on a mobile device use local server
  //var server = 'http://' + document.location.host;
  var server = 'http://vast-crag-6780.herokuapp.com';
} else {
  //connect to heroku if running on phone
  var server = 'http://vast-crag-6780.herokuapp.com';
}

var debug;        //for testing stuff
var current_user;
var app = new $.mvc.app();
//app.loadModels(['user', 'chat', 'person', 'place', 'photo']);
//app.loadControllers(['users_controller', 'chats_controller', 'people_controller',
//  'places_controller', 'photos_controller']);
app.listenHashChange();
app.useHTML5History(true);
//return $(document).trigger("$.ui.ready");
$.ui.ready(function () {
  0;
  current_user.load_local_data();


  if (current_user.token.length > 5) {
    0;
    $.mvc.route('/users_controller/');
  } else {
    0;
    $.mvc.route('/users_controller/login_register');
  }
});