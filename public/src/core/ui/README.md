# Mobile Webkit UI/UX

# Duplicates & Problems to fix

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


## Usage
There are four special registered div blocks for a layout based off id's.
The ids are header(top header), content (content area), navbar(bottom navbar), and jqUi (app container).

To add divs to the content, simply set the class to “panel”
`<div id="my_id" title="My Title" class="panel">`
`<!-- content goes here -->`
`</div>`

To add a new div dynamically, call the function `addContentDiv(id,content);`
`<script>$.ui.addContentDiv("newdiv","This is some new html");</script>`


To navigate to a page transition via javascript, call the function loadContent(_id_,clear_history,goBackInHistory,transition)



To update content, call the function updateContentDiv(div_id,content);
`$.ui.updateContentDiv("login","New Login HTML");`

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
showBackButton                //boolean to show the back button
reset_scrollers                //boolean to reset the scroller position when navigating panels (default true)
ready(function)               //Takes in a function and executes it when launch() has completed
set_back_button_style(class) //override the back button class name
go_back()                           //goes to the previous page in history
clear_history()                       //clears the history stack
update_badge(target,value,[position])  //update a badge on the selected target
remove_badge(target)                     //remove a badge from the selected target
toggle_footer_menu([force])               //will hide or show the bottom nav menu   WTF is force?
toggle_header_menu([force])                 //hide or show the header menu
toggle_side_menu([force])                     //hide or show the side menu
update_footer_elements(elements)          //update the elements in the footer
update_side_menu(elements)                //update the elements in the side menu
set_title(value) set the title of the current panel
set_title(text) //Sets the page title via javascript
setBackButtonText(text) //Sets the back button text (default is back)
showMask(text) show the loading mask
showMask() //Shows the loading mask
hideMask() //Hides the loading mask
showModal() load a content panel in a modal window
hideModal() hide the modal window and remove the content
updateContentDiv(id,content) update the HTML in a content panel
addContentDiv(id,content,title) dynamically create a new panel
addContentDiv (el, content, refresh, refreshFunc) //Adds a div to the DOM and wires it up.  refresh and refreshFunc are used for the jq.scroller pull to refresh functions
updateAnchors(element,resetHistoryOnClick) //Loops through a div and finds all anchors and wires them up for transitions, etc.  If resetHistoryOnClick is true, it will clear the history when the links are clicked
loadContent(target,newTab,go_back,transition) initiate a transition or load via ajax
loadContent(target,newTab,goBackInHistory,transition); //Force a transition call via javascript. target is an element ID or URL.  newTab clears the stack as if a bottom navbar button was pressed.  goBackInHistory is the same as a back button being pressed.  Transition is the transition to show.
scrollToTop(id) scroll a panel to the top
scrollToTop(div_id) //Will scroll a content panel to the top of the page.  Useful for "Go to Top" links
slideTransition(prevPanel,currPanel,go_back) initiate a sliding transition
finishTransition(oldDiv) called at end of each transition to hide the old div and reset the doingTransition variable

```

**jqPluginsAccess ($.ui)**
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


#jqUi anchor properties

Anchors can have special properties for wiring transitions and events

``` html
<a href="#id" data-transition="pop">Pop</a>  //data-transition allows you to set the transtion
<a href="http://www.mysite.com/api/getdata" data-refresh-ajax="true">Get Latest Data</a> //data-refresh-ajax allows you to always get the latest data from an Ajax request
<a href="http://www.mysite.com/api/twitterfeed" data-pull-scroller="true">Get latest twitter feed</a> // data-pull-scroller will tell the scrolling div to enable Pull to Refresh
<a href="http://www.mysite.com/api/twitterfeed" data-persist-ajax="true">Add this to the dom</a> // data-persist-ajax will take the result and add it to the dom.  When users navigate to that URL now, it will no longer make an Ajax refresh and adds the div to the container. 
``` 

#jqUi panel properties

Each div/panel has properties you can set that will change the app.  Below are the properties
``` html
   data-footer = "_id_"  //Change the custom footer
   
   data-nav = "_id_" //Change the custom nav
   
   data-load="function_name" //Function that is called when a panel is loaded - passes in the div
   
   data-unload="function_name" //Function that is called when a panel is unloaded - passes in the div
   
   data-modal="true" //Load the panel in a modal window
   
   data-defer="filename.html" //Defer loading teh panel until $.ui.ready and specify the path of the html file to load
```
# Tips

* Ajax - you can add an ajax request into the DOM that will be accessible by the URL referenced by setting the data-persist attribute.  You can force a refresh by setting data-refresh-ajax="true".  You can also make the scroller "pull to refresh" by setting data-pull-scroller="true"

``` html
    <a href="http://www.appmobi.com" data-persist="true">AppMobi</a>  //Div will be added to the dom
    <a href="http://www.appmobi.com" data-persist="true" data-refresh-ajax="true">AppMobi</a>  //Everytime the link is clicked, it will fetch the data
    <a href="http://www.appmobi.com" data-pull-scroller="true">AppMobi</a>  //When the scroller content is pulled down, it will refresh the page
```	



	
* To update the content of a div, you must call the function updateContentDiv(_id_,_content_);

``` js
<script>$.ui.updateContentDiv("login","New Login HTML");
```	

* To dynamically add a new div, you can call the function addContentDiv(_id_,_content_);

``` js
<script>$.ui.addContentDiv("newdiv","This is some new html");
```	

* To navigate to a a page transition via javascript, you can call the function loadContent(_id_,clear_history,goBackInHistory,transition)

``` js
<scritp>$.ui.loadContent("my_id",false,false,"pop");</script>
```

* To prevent a div from scrolling, set the property "scrolling" to "no" on the div

``` html
<div class="panel" scrolling="no"></div>
```

* To get the current active div/page

``` html
<script>$.ui.active_div //reference to the div</script>
<script>var activeId=$.ui.active_div.id</script>
``` 
	
* To make the back button text static

``` html
<script>$.ui.backButtonText="Back...";</script>
```

* To change the back button text dynamically

``` html
<script>$.ui.setBackButtonText("Go Back");</script>
```

* To reprocess a div and autowire the anchors again

``` html
<script $.ui.updateAnchors(_element);</script>	
```
	
* You can assign a javascript function to be executed on panel load and unload.
   
``` html
<script>
function getApps(targetDiv)
{
    targetDiv.innerHTML="The id called = "+obj.id;
}
function getAppsClosed(targetDiv)
{
    targetDiv.innerHTML="The id called = "+obj.id+" and the panel was unloaded";
}
</script>
<a href="#games" data-function="getApps" data-load="getApps" data-onunload="getAppsClosed"> Games </a>
```

# Need to include info about the css here
# 12 column fluid layout
