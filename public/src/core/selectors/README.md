# Selector API

The selector objects:
```js
$('#main') = jq('#main')  
```

W3C specified queries are supported. The following can be done:  
```js
$("input[type='text']")
```

The following cannot be done:  
```js
$('input:text')  
```

In some functions, an additional selector can be used of type string, array, or a selector object but not a function.  
 
### Syntax:  
Basic call `$('#id').hide()`
A DOM element, selector, list of nodes, or HTML string can be specified.  
```js
//find all span elements and attach a click event
$('span').bind('click', function() {
   console.log('clicked');
});
```

`var myDiv=$('<div id='foo'>')` creates a div object and returns it

### AJAX Calls - all these need fixing
```js
$.get(url, callback)               //makes an AJAX request to the URL and executes the callback function
                                   //with the result
$.post(url, data, callback, dataType) //makes an AJAX POST request to the URL with the data and executes the
                                   //callback with the result. An optional dataType can be passed in, as
                                   //some web services require the header.
$.getJSON(url, data, callback)       //makes an AJAX request with the data and executes callback function
                                   //passing in a JSON object from the AJAX response into the callback
                                   //function.
```

Full access to AJAX:  
```javascript
$.ajax {
type:'POST',                      //defaults to GET
url:'/api/getinfo',               //defaults to window.location  ***FIX HERE***
contentType: 'application/json',  //defaults to application/x-www-formurlencoded  ***FIX TO JSON***
headers:{},                       //set necessary headers
dataType:'application/json',      //defaults to text/html
data:{username:foo},              //can be a Key/Value pair string or object. If it's an object,
                                  //$.serialize is called to turn it into a key/value pair string
success:function(data){},         //function to call on successful Ajax request
error:function(data){}            //function to call when an error exists in the Ajax request
}  
```

If the url contains the pattern =? in it, a JSONP request will be made. These can ONLY be GET requests

### Plugins
To create a plugin, extend the `$.fn` object by passing a reference of the main `$` object

``` js
(function($){
  $.fn['foo']=function(){
     alert('bar');
  }
})(jq);
```

### Functions
```js
$.map(elements, callback)                  //executes callback function on each element
$.each(elements, callback)                 //iterate through elements and execute callback
$.extend(target, {params})                 //extends an object with additional arguments
$.isArray(data)                           //returns true/false if data is an array
$.isFunction(data)                        //returns true/false if data is a function
$.isObject(param)                         //returns true/false if param is an object
$.ready(callback)                         //callback executed when DOMContentLoaded happens
$.find(selector)                          //find all children that match the given selector
$.html(['new html'])                      //get/set the elements .innerHTML
$.text(['new text'])                      //get/set the elements .innerTEXT
$.css('property', ['value'])               //get/set the elements css property to value
$.empty()                                 //sets the elements .innerHTML to an empty string
$.hide()                                  //sets the elements display css attribute to 'none'
$.show()                                  //sets the elements display css attribute to 'block'
$.toggle()                                //toggles the elements display css attribute
$.val(['value'])                          //get/set the elements value property
$.attr('attribute', ['value'])             //get/set the elements attribute
$.removeAttr('attribute')                 //removes the attribute from the elements
$.remove()                                //remove an element from the Dom
$.addClass('className')                   //adds the css class name to the selected elements
$.removeClass('className')                //removes a css class from the selected elements
$.hasClass('className', [element])        //checks to see if an element has a class
$.append(element, [insert])                //appends an element to the selected elements
$.prepend(element)                        //prepends an element to the selected elements
$.insertBefore(target)                    //inserts a collection before the target (adjacent)
$.insertAfter(target)                     //inserts a collection after the target (adjacent)
$.get([index])                            //get raw DOM element based on index. () returns first element
$.offset()                                //calculates the first elements offset on the screen
$.parent(selector)                        //returns the parent nodes based off selector
$.children(selector)                      //returns the children of the elements
$.siblings(selector)                      //returns the siblings of the elements
$.closest(selector, [context])             //returns the closest element based off selector
$.filter(selector)                        //filters the elements based off selector
$.not(selector)                           //return all matches that do NOT match the selector
$.data(key,[value])                       //gets/sets a data-* attribute for the param
$.end()                                   //rolls back the jqMobi elements when filters were applied
$.clone()                                 //clones the nodes in the collection
$.size()                                  //returns the number of elements in a collection
$.serialize(grouping)                     //serializes a form into a query string
$.jsonP(options)                          //execute a JSONP call
$.bind('event', function(){})              //binds a function to the event listener
$.unbind('event', [callback])              //unbinds a function to the event listener
$.one('event', callback)                   //bind event to each element - only executes once
$.delegate(selector, 'event', callback)     //delegate an event based off selector
$.undelegate(selector, 'event', [callback]) //unbind an event registered through delegate
$.on('event', selector, callback)           //similar to delegate()
$.off('event', selector, [callback])        //removes event listeners for on()
$.trigger('event', data)                  //trigger an event and pass in optional data
$.proxy(callback, context)                //creates a proxy function so the 'this' context can be changed
                                          //in the function
```

### Helper Functions
```js
$.param()                 //serialize a JSON object into key/value pairs for a query string
$.parseJSON(string)       //backwards compatibility JSON parsing call. Uses the browsers native JSON parser
$.parseXML(string)        //parses a string and returns a XML document version
$.uuid                    //utility function to create a pseudo GUID
$.Event(type, properties)  //creates a custom event to be used internally
```

### OS Detectors
```js
$.os.webkit     //true if webkit found in the user agent
$.os.android    //true if android user agent
$.os.ipad       //true if iPad user agent
$.os.iphone     //true if iPhone user agent
$.os.webos      //true if WebOS detected
$.os.touchpad   //true if WebOS and Touchpad user agent
$.os.ios        //true if iPad or iPhone
$.os.blackberry //true if Blackberry PlayBook or OS >=6
```