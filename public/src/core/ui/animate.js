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