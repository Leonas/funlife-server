# Mobile UI Kit

### Show a page
 make defaults
```js
$.ui.show_page({
header: id_of_header or null
footer: tab_id or null
left_button: id_of_left_button_div or null
right_button: id_of_right_button_div or null
title: 'FunLife',
active_nav: '#bottom_nav_home',
div_id: 'user_index_view',
template: 'views/users/user_index_view.js',
api_url: '/users/',
data: false
on_load: function(){}
on_unload: function(){} , presets of 'instant_disposal', 'no_disposal', 'default_disposal'
scrolling: true, js scrlloling is by phone data
})
```

`$.show_page` will first show locally stored content before making an ajax request to speed up load.


### API for $.ui
(Prefix all calls with `$.ui`)

```js

For Repairs
   .reset_scrollers                //boolean to reset the scroller position when navigating panels (default true)
    //it resets even when set to false


    .set_back_button_text(optional_text)        //Sets the back button text (default is back)
    //only repair this if this is needed as a helper, otherwise delete
end

.load_default_hash  boolean to load/not load panel from hash when app started (default is true)



//Settings
.show_footer_menu        //boolean to show bottom nav bar
.auto_launch             //boolean to auto launch jqUi


//Functions
.launch()                              //Manually invoke the launch of jqUi. If auto_launch is true, gets called
                                       //on DOMContentLoaded
.set_back_button_visibility(force)     //force back button visibility to true or false
.ready(function)                       //Takes in a function and executes it when launch() has completed
.set_back_button_style(class)          //sets new class for the back button
.go_back()                             //goes to the previous page in history
.clear_history()                       //clears the history stack & removes back button
.toggle_header_menu(optional_boolean)  //hide or show the header menu
.toggle_side_menu(optional_boolean)    //hide or show the side menu
.toggle_footer_menu(optional_boolean)  //will hide or show the bottom nav menu
.set_title(value)                      //set the title of the current panel
.show_modal(div_id)                    //load a content panel in a modal window
.hide_modal()                          //hide the modal window and remove the content
.scrollToTop(div_id)                   //Will scroll a content panel to the top of the page.  Useful for "Go to Top" links
.update_content_div(id, content)       //update the HTML in a content panel
.active_div                            //reference to the div. id = $.ui.active_div.id




//Used by $.show_page
.add_content_div (element, content_string, title, refresh)  //Adds a div to the DOM and wires it up.
.load_content(target,newTab,goBackInHistory,transition);    //Force a transition call via javascript.
                                                            //target is an element ID or URL.  newTab clears
                                                            //the stack as if a bottom navbar button was pressed.
                                                            //goBackInHistory is the same as a back button being
                                                            //pressed.  Transition is the transition to show.

//Not inspected yet
.slideTransition(prevPanel, currPanel, go_back)     //initiate a sliding transition
.finishTransition(oldDiv)                         //called at end of each transition to hide the old div and reset
.update_footer_elements(elements)                 //update the elements in the footer
.update_side_menu(elements)                       //update the elements in the side menu                                                            //the doingTransition variable

```

