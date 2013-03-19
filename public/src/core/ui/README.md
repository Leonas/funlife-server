# Mobile Webkit UI/UX

### Panel Choices to make
header: which id?
footer: which tab?
back button true/false




### Headers


### Footers


### Side Menu


# Content Area

### Loading Content

Using functionX, pass in the following options:

unload, load

### Updating Content







## Usage
There are four special registered div blocks for a layout based off id's.
The ids are header(top header), content (content area), navbar(bottom navbar), and ui_kit (app container).

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


```js
$.ui.load_default_hash  boolean to load/not load panel from hash when app started (default is true)
$.ui.block_ui(opacity)       ///throw up a mask and block the UI
$.ui.unblock_ui()           //removes the UI mask
$.ui.remove_footer_nav()    //removes the bottom nav bar from app
$.ui.show_footer_menu       //boolean to show bottom nav bar
$.ui.auto_launch             //boolean to auto launch jqUi
$.ui.is_ajax_app                 //boolean that when true treats every request as if the anchor had
                            //data-refresh-ajax=true and data-persist-ajax=true
$.ui.show_loading                   //boolean to show/not show loading spinner on ajax requests
$.ui.launch()                      //Manually invoke the launch of jqUi. If auto_launch is true, gets called
                              //on DOMContentLoaded
$.ui.set_back_button_visibility(something)   //look it up
$.ui.reset_scrollers                //boolean to reset the scroller position when navigating panels (default true)
$.ui.ready(function)               //Takes in a function and executes it when launch() has completed
$.ui.set_back_button_style(class) //override the back button class name
$.ui.go_back()                           //goes to the previous page in history
$.ui.clear_history()                       //clears the history stack
$.ui.update_badge(target,value,[position])  //update a badge on the selected target
         * Update a badge on the selected target.  Position can be
            bl = bottom left
            tl = top left
            br = bottom right
            tr = top right (default)
           ```
           $.ui.update_badge('#mydiv','3','bl','green');
$.ui.remove_badge(target)                     //remove a badge from the selected target
$.ui.toggle_footer_menu(optional_boolean)               //will hide or show the bottom nav menu
$.ui.toggle_header_menu(optional_boolean)                 //hide or show the header menu
$.ui.toggle_side_menu(optional_boolean)                     //hide or show the side menu
$.ui.update_footer_elements(elements)          //update the elements in the footer
$.ui.update_side_menu(elements)                //update the elements in the side menu
$.ui.set_title(value) set the title of the current panel
$.ui.set_title(text) //Sets the page title via javascript
$.ui.set_back_button_text(optional_text)        //Sets the back button text (default is back)
$.ui.show_loading_mask(optional_text)           //show the loading mask
$.ui.hide_loading_mask()                      //Hides the loading mask
$.ui.show_modal(div_id)                      //load a content panel in a modal window
$.ui.hide_modal()                            //hide the modal window and remove the content ?? Does it really remove?
$.ui.update_content_div(id,content) update the HTML in a content panel
$.ui.active_div                   //reference to the div. id = $.ui.active_div.id



add_content_div (element, content_string, title, refresh)       //Adds a div to the DOM and wires it up.

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

### What is the actionsheet? Add comments on it too

### div id='ui_kit'
This is the container div
Everything must be put inside this

### div id='header'
This is the top header.
You can add additional buttons, turn other events on/off on clicks if you need.
We handle the back button and the title for you.
If this is not present, we will create it.

### div id='content'
This is the content area.
You do not need to add anything here.
All panel divs will be added here.
If you put a div in there, it will be shown first.

### div id='navbar'
this is the bottom navbar.
You can put your navigation buttons here.
We reset the history queue when you switch the navigation buttons.
This is optional.
If you do not include it, it will not be shown.



* jq.scroller is added automatically, along with jq.select_box, jq.password_box, and jq.css3animate.




#jqUi Side Menu

You can add a side menu by creating <nav> elements.
You can assign them to panels by setting the data-nav attribute.
Note, the first nav is the default and will be shown unless specificied with the data-nav attribute.

``` html
<div id="welcome" data-nav="mainnav">
</div>
<nav id="mainnav">
 <h2>This is a custom nav</h2>
</nav>
```


