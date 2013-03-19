# Mobile Webkit UI/UX

# Duplicates & Problems to fix
*  Search the code for load and unload references but the actual unload panel function was never defined
* on each show page, we need to add in scrolling option
* defered loading - make this work with routing and not how it works now

Remove this crap I only want it setable from the router:
* We handle history and transitions.  You can select from six transitions by setting the data-transition property.  The default is slide.

``` html
    <a href="#login" data-transition="slide">Login</a>  //slide left/right
    <a href="#login" data-transition="up">Login</a>  //slide up/down
    <a href="#login" data-transition="down">Login</a>  //slide down/up
    <a href="#login" data-transition="flip">Login</a>  //Flip the page
    <a href="#login" data-transition="fade">Login</a>  //Fade in/out
    <a href="#login" data-transition="pop">Login</a>  //Pop in/out
```

#These dont work. Need to fix this up. Probably just move these functions into the router

Each div/panel has properties you can set that will change the app.  Below are the properties
``` html
   data-footer = "_id_"  //Change the custom footer
   data-nav = "_id_" //Change the custom nav
   data-load="function_name" //Function that is called when a panel is loaded - passes in the div
   data-unload="function_name" //Function that is called when a panel is unloaded - passes in the div
   data-modal="true" //Load the panel in a modal window
   data-defer="filename.html" //Defer loading teh panel until $.ui.ready and specify the path of the html file to load
<div class="panel" scrolling="no"></div>

```


## Usage
There are four special registered div blocks for a layout based off id's.
The ids are header(top header), content (content area), navbar(bottom navbar), and jqUi (app container).

To add divs to the content, simply set the class to “panel”
`<div id="my_id" title="My Title" class="panel">`
`<!-- content goes here -->`
`</div>`

To add a new div dynamically, call the function `add_content_div(id,content);`
`<script>$.ui.add_content_div("newdiv","This is some new html");</script>`


To navigate to a page transition via javascript, call the function load_content(_id_,clear_history,goBackInHistory,transition)



To update content, call the function update_content_div(div_id,content);
`$.ui.update_content_div("login","New Login HTML");`

To prevent a div from scrolling, set the property “scrolling” to “no” on the div
`<div class=”panel” scrolling=”no”></div>`

To add custom headers or footers via the <header> or <footer> tags, reference them on the panel with the data-header of data-footer attribute, respectively.

**Prefix all calls with** `$.ui.`
```js
load_default_hash  boolean to load/not load panel from hash when app started (default is true)
block_ui(opacity)       ///throw up a mask and block the UI
unblock_ui()           //removes the UI mask
remove_footer_menu()    //removes the bottom nav bar from app
show_footer_menu       //boolean to show bottom nav bar
auto_launch             //boolean to auto launch jqUi
is_ajax_app                 //boolean that when true treats every request as if the anchor had
                            //data-refresh-ajax=true and data-persist-ajax=true
show_loading                   //boolean to show/not show loading spinner on ajax requests
launch()                      //Manually invoke the launch of jqUi. If auto_launch is true, gets called
                              //on DOMContentLoaded
set_back_button_visibility(something)   //look it up
reset_scrollers                //boolean to reset the scroller position when navigating panels (default true)
ready(function)               //Takes in a function and executes it when launch() has completed
set_back_button_style(class) //override the back button class name
go_back()                           //goes to the previous page in history
clear_history()                       //clears the history stack
update_badge(target,value,[position])  //update a badge on the selected target
remove_badge(target)                     //remove a badge from the selected target
toggle_footer_menu(optional_boolean)               //will hide or show the bottom nav menu   WTF is force?
toggle_header_menu(optional_boolean)                 //hide or show the header menu
toggle_side_menu(optional_boolean)                     //hide or show the side menu
update_footer_elements(elements)          //update the elements in the footer
update_side_menu(elements)                //update the elements in the side menu
set_title(value) set the title of the current panel
set_title(text) //Sets the page title via javascript
set_back_button_text(optional_text)        //Sets the back button text (default is back)
show_loading_mask(optional_text)           //show the loading mask
hide_loading_mask()                      //Hides the loading mask
show_modal(div_id)                      //load a content panel in a modal window
hide_modal()                            //hide the modal window and remove the content ?? Does it really remove?
update_content_div(id,content) update the HTML in a content panel
$.ui.active_div                   //reference to the div. id = $.ui.active_div.id


//DOC CONFLICT
add_content_div (element, content_string, title, refresh, refreshFunc)       //Adds a div to the DOM and wires it up.
                                                        //refresh and refreshFunc are used for the jq.scroller
                                                        //pull to refresh functions
load_content(target,newTab,goBackInHistory,transition);   //Force a transition call via javascript.   DOESTHISUSEAJAX? DOC ERROR
                                                        //target is an element ID or URL.  newTab clears
                                                         //the stack as if a bottom navbar button was pressed.
                                                         //goBackInHistory is the same as a back button being
                                                         //pressed.  Transition is the transition to show.
scrollToTop(div_id) //Will scroll a content panel to the top of the page.  Useful for "Go to Top" links
slideTransition(prevPanel,currPanel,go_back) initiate a sliding transition
finishTransition(oldDiv) called at end of each transition to hide the old div and reset the doingTransition variable

```

**Plugins**
```js
actionSheet(opts) shorthand call to jq.actionsheet plugin. Auto wired to jQUi div.
`popup(opts) wrapper to jq.popup plugin. If a text string is passed in, acts like an alert box and just gives a message.
```

We have four special registered div blocks for your layout based off id's.  They are the header, content, navbar and app container

* jQUi - This is the container div.  If you do not include it, we create it and move everything inside.  This is for people who want to use jqUi inside a prexisting project

* header - this is the top header.  You can add additional buttons, turn other events on/off on clicks if you need.  We handle the back button and the title for you.  If this is not present, we will create it. 

* content - this is the content area.  You do not need to add anything here.  All page divs will be added here.  If you put a div in there, it will be shown first.

    Each div inside will need the class "panel".  jqUi will search for all elements with that classname and add them automatically.  These will scroll by default.
	
* navbar - this is the bottom navbar.  You can put your navigation buttons here.  We reset the history queue when you switch the navigation buttons.  This is optional.  If you do not include it, it will not be shown.

* You can manipulate the height of the divs via the CSS class.  If you do not want the header to be shown, you can set the display property to none.

* To add divs to the content, simply set the class to "panel".  This is a special css class that we search for at startup.
 
* jq.scroller is added automatically, along with jq.select_box, jq.password_box, and jq.css3animate.

* Linking to pages - You can link two ways.  You can link to a file by setting the URL, which will load via AJAX.  Or you can set the href property to "#div_id"
``` html
<a href="#login">Login</a>
```

* We automatically launch the app for you.  If you would like to launch jqUi yourself, do the following
``` js
<script>
jq.ui.auto_launch=false;
<script>
```	

* We throw an event when jqUi.launch has completed if you need one.  There is also a ready function
``` js
document.addEventListener("jq.ui.ready",jqUiLaunched,false);
jq.ui.ready(function(){});
```




#jqUi Side Menu

You can add a side menu by creating <nav> elements.  You can assign them to panels by setting the data-nav attribute.  Note, the first nav is the default and will be shown unless specificied with the data-nav attribute.
On tablets, this will be shown by default

``` html
<div id="welcome" data-nav="mainnav">
</div>
<nav id="mainnav">
 <h2>This is a custom nav</h2>
</nav>
```

#jqUi Custom Footers
You can add additional footer menus that can be assigned to each panel.

``` html
<div id="welcome" data-footer="footerui2">
</div>
 <footer id='footerui2'>
	 <div class="horzRule"></div>
      <a href="#main" id='navbar_home' class='navbar_home' >Home <span class='jq-badge lr'>6</span></a>
      <a href="#jqmtransitions" id='navbar_js' class="navbar_js" >Trans</a>
	  <a href="#jqmui" id='navbar_ui'  class="navbar_ui" >ui</a>
	  <a href="#uiapi" id='navbar_plugins'  class="navbar_plugins" >api</a>
</footer>
```


# Verified Zone

