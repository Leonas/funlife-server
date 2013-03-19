(function($) {


    var has_launched = false;
    var start_path = window.location.pathname;
    var default_hash = window.location.hash;
    var previous_target = default_hash;
    var ui = function() {
        // Init the page
        var that = this;

        //setup the menu and boot touch_layer
        jq(document).ready(function() {

            //boot touch_layer
            //create jQUi element if it still does not exist
            var jQUi = document.getElementById("jQUi");
            if (jQUi == null) {
                jQUi = document.createElement("div");
                jQUi.id = "jQUi";
                var body = document.body;
                while (body.firstChild) {
                    jQUi.appendChild(body.firstChild);
                }
                jq(document.body).prepend(jQUi);
            }
            if (jq.os.supportsTouch)
                $.touch_layer(jQUi);
        });

        if (window.AppMobi)
            document.addEventListener("appMobi.device.ready", function() {
                that.autoBoot();
                this.removeEventListener("appMobi.device.ready", arguments.callee);
            }, false);
        else if (document.readyState == "complete" || document.readyState == "loaded") {
            this.autoBoot();
        }
        else
            document.addEventListener("DOMContentLoaded", function() {
                that.autoBoot();
                this.removeEventListener("DOMContentLoaded", arguments.callee);
            }, false);

        if (!window.AppMobi)
            AppMobi = {}, AppMobi.webRoot = "";

        //click back event
         window.addEventListener("popstate", function() {

            var id = $.ui.get_panel_id_from_hash(document.location.hash);
            //make sure we allow hash changes outside jqUi
            if(id==""&&$.ui.history.length===1) //Fix going back to first panel and an empty hash
                id="#"+$.ui.firstDiv.id;
            if(id=="")
                return;
            if(document.querySelectorAll(id+".panel").length===0)
                return;
            if (id != "#" + $.ui.active_div.id)
                that.go_back();
        }, false);
        /**
         * Helper function to setup the transition objects
         * Custom transitions can be added via $.ui.availableTransitions
           ```
           $.ui.availableTransitions['none']=function();
           ```
         */

        this.availableTransitions = {};
        this.availableTransitions['default'] = this.availableTransitions['none'] = this.noTransition;
    };


    ui.prototype = {
        show_loading: true,
        loadContentQueue: [],
        isAppMobi: false,
        titlebar: "",
        navbar: "",
        header: "",
        viewport_container: "",
        backButton: "",
        remotePages: {},
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
        password_box: jq.password_box ? new jq.password_box() : false,
        select_box: jq.select_box ? jq.select_box : false,
        ajax_url: "",
        transition_effect: "fade",
        scrollingDivs: [],
        firstDiv: "",
        has_launched: false,
        launch_completed: false,
        active_div: "",
        custom_click_handler: "",
        menu_animation: null,
        side_menu_displayed: false,
        autoBoot: function() {
            this.has_launched = true;
            if (this.autoLaunch) {
                this.launch();
            }
        },
        css3animate: function(element, options) {
            element = jq(element);
            return element.css3Animate(options);
        },
        loadDefaultHash: true,        //load THAT(wtf is that?) panel when the app is started
        useAjaxCacheBuster: false,    //add "&cache=_rand_" to any ajax loaded link
        /**
         * This is a shorthand call to the jq.actionsheet plugin.  We wire it to the jQUi div automatically
           ```
           $.ui.actionsheet("<a href='javascript:;' class='button'>Settings</a> <a href='javascript:;' class='button red'>Logout</a>")
           $.ui.actionsheet("[{
                        text: 'back',
                        cssClasses: 'red',
                        handler: function () { $.ui.go_back(); ; }
                    }, {
                        text: 'show alert 5',
                        cssClasses: 'blue',
                        handler: function () { alert("hi"); }
                    }, {
                        text: 'show alert 6',
                        cssClasses: '',
                        handler: function () { alert("goodbye"); }
                    }]");
           ```
         * @param {String,Array} links
         * @title $.ui.actionsheet()
         */
        actionsheet: function(options) {
            return jq("#jQUi").actionsheet(options);
        },

        //Makes a popup. Look at popup.js for options
        popup: function(options) { return $("#jQUi").popup(options); },

        //blocks the UI with a mask
        blockUI: function(opacity) { $.blockUI(opacity); },

        //removes the UI mask
        unblockUI: function() { $.unblockUI(); },

        //removes bottom nav
        remove_footer_menu: function() {
            jq("#navbar").hide();
            jq("#content").css("bottom", "0px");
            this.show_nav_menu = false;
        },

        show_nav_menu: true,
        autoLaunch: true,
        showBackbutton: true,
        backButtonText: "",
        reset_scrollers: true,

        // function to fire when jqUi is ready and completed launch
        ready: function(param) {
            if (this.launch_completed)
                param();
            else
                document.addEventListener("jq.ui.ready", function(e) {
                    param();
                    this.removeEventListener('jq.ui.ready', arguments.callee);
                }, false);
        },

        //set a new back button class name
        set_back_button_style: function(className) {
            jq("#backButton").get(0).className = className;
        },


        go_back: function() {
            if (this.history.length > 0) {
                var that = this;
                var temporary_element = this.history.pop();
                //$.asap(

                //function() {
                    that.loadContent(temporary_element.target + "", 0, 1, temporary_element.transition);
                    that.transition_effect = temporary_element.transition;
                    //document.location.hash=temporary_element.target;
                    that.update_url_hash(temporary_element.target);
                //for Android 4.0.x, we must touch_layer.hideAdressBar()
            //    });
            }
        },

        clear_history: function() {
            this.history = [];
            this.setBackButtonVisibility(false)
        },


        pushHistory: function(previousPage, newPage, transition, hashExtras) {
            //push into local history
            this.history.push({
                target: previousPage,
                transition: transition
            });
            //push into the browser history
            try {
                window.history.pushState(newPage, newPage, start_path + '#' + newPage + hashExtras);
                $(window).trigger("hashchange", {
                    newUrl: start_path + '#' + newPage + hashExtras,
                    oldURL: start_path + previousPage
                });
            } catch (e) {
            }
        },


        /**
         * Updates the current window hash
         *
         * @param {String} new_hash New Hash value
         * @title $.ui.update_url_hash(new_hash)
         */
        update_url_hash: function(new_hash) {
            new_hash = new_hash.indexOf('#') == -1 ? '#' + new_hash : new_hash; //force having the # in the begginning as a standard
            previous_target = new_hash;

            var previousHash = window.location.hash;
            var panelName = this.get_panel_id_from_hash(new_hash).substring(1); //remove the #
            try {
                window.history.replaceState(panelName, panelName, start_path + new_hash);
                $(window).trigger("hashchange", {
                    newUrl: start_path + new_hash,
                    oldUrl: start_path + previousHash
                });
            } catch (e) {
            }
        },
        /*gets the panel name from an hash*/
        get_panel_id_from_hash: function(hash) {
            var firstSlash = hash.indexOf('/');
            return firstSlash == -1 ? hash : hash.substring(0, firstSlash);
        },

        /**
         * Update a badge on the selected target.  Position can be
            bl = bottom left
            tl = top left
            br = bottom right
            tr = top right (default)
           ```
           $.ui.updateBadge('#mydiv','3','bl','green');
           ```
         * @param {String} target
         * @param {String} Value
         * @param {String} [position]
         * @param {String|Object} [color or CSS hash]
         * @title $.ui.updateBadge(target,value,[position],[color])
         */
        updateBadge: function(target, value, position, color) {
            if (position === undefined)
                position = "";
            if (target[0] != "#")
                target = "#" + target;
            var badge = jq(target).find("span.jq-badge");

            if (badge.length == 0) {
                if (jq(target).css("position") != "absolute")
                    jq(target).css("position", "relative");
                badge = jq("<span class='jq-badge " + position + "'>" + value + "</span>");
                jq(target).append(badge);
            } else
                badge.html(value);


            if (jq.isObject(color)) {
                badge.css(color);
            } else if (color) {
                badge.css("background", color);
            }

            badge.data("ignore-pressed", "true");

        },
        /**
         * Removes a badge from the selected target.
           ```
           $.ui.removeBadge('#mydiv');
           ```
         * @param {String} target
         * @title $.ui.removeBadge(target)
         */
        removeBadge: function(target) {
            jq(target).find("span.jq-badge").remove();
        },
        /**
         * Toggles the bottom nav nav menu.  Force is a boolean to force show or hide.
           ```
           $.ui.toggleNavMenu();//toggle it
           $.ui.toggleNavMenu(true); //force show it
           ```
         * @param {Boolean} [force]
         * @title $.ui.toggleNavMenu([force])
         */
        toggleNavMenu: function(force) {
            if (!this.show_nav_menu)
                return;
            if (jq("#navbar").css("display") != "none" && ((force !== undefined && force !== true) || force === undefined)) {
                jq("#content").css("bottom", "0px");
                jq("#navbar").hide();
            } else if (force === undefined || (force !== undefined && force === true)) {
                jq("#navbar").show();
                jq("#content").css("bottom", jq("#navbar").css("height"));

            }
        },
        /**
         * Toggles the top header menu.
           ```
           $.ui.toggleHeaderMenu();//toggle it
           ```
         * @param {Boolean} [force]
         * @title $.ui.toggleHeaderMenu([force])
         */
        toggleHeaderMenu: function(force) {
            if (jq("#header").css("display") != "none" && ((force !== undefined && force !== true) || force === undefined)) {
                jq("#content").css("top", "0px");
                jq("#header").hide();
            } else if (force === undefined || (force !== undefined && force === true)) {
                jq("#header").show();
                var val = numOnly(jq("#header").css("height"));
                jq("#content").css("top", val + 'px');
            }
        },
        /**
         * Toggles the side menu.  Force is a boolean to force show or hide.
           ```
           $.ui.toggleSideMenu();//toggle it
           ```
         * @param {Boolean} [force]
         * @title $.ui.toggleSideMenu([force])
         */
        toggleSideMenu: function(force, callback) {
            if (!this.isSideMenuEnabled() || this.side_menu_displayed)
                return;
            this.side_menu_displayed = true;

            var that = this;
            var menu = jq("#menu");
            var els = jq("#content, #menu, #header, #navbar");

            if (!(menu.hasClass("on") || menu.hasClass("to-on")) && ((force !== undefined && force !== false) || force === undefined)) {

                menu.show();
                that.css3animate(els, {
                    "removeClass": "to-off off on",
                    "addClass": "to-on",
                    complete: function(canceled) {
                        if (!canceled) {
                            that.css3animate(els, {
                                "removeClass": "to-off off to-on",
                                "addClass": "on",
                                time: 0,
                                complete: function() {
                                    that.side_menu_displayed = false;
                                    if (callback)
                                        callback(false);
                                }
                            });
                        } else {
                            that.side_menu_displayed = false;
                            if (callback)
                                callback(true);
                        }
                    }
                });

            } else if (force === undefined || (force !== undefined && force === false)) {


                that.css3animate(els, {
                    "removeClass": "on off to-on",
                    "addClass": "to-off",
                    complete: function(canceled) {
                        if (!canceled) {
                            that.css3animate(els, {
                                "removeClass": "to-off on to-on",
                                "addClass": "off",
                                time: 0,
                                complete: function() {
                                    menu.hide();
                                    that.side_menu_displayed = false;
                                    if (callback)
                                        callback(false);
                                }
                            });
                        } else {
                            that.side_menu_displayed = false;
                            if (callback)
                                callback(true);
                        }
                    }
                });
            }
        },

        disableSideMenu: function() {
            var that = this;
            var els = jq("#content, #menu, #header, #navbar");
            if (this.isSideMenuOn()) {
                this.toggleSideMenu(false, function(canceled) {
                    if (!canceled)
                        els.removeClass("hasMenu");
                });
            } else
                els.removeClass("hasMenu");
        },

        enableSideMenu: function() {
            var that = this;
            var els = jq("#content, #menu, #header, #navbar");
            els.addClass("hasMenu");
        },

        isSideMenuEnabled: function() {
            return jq("#content").hasClass("hasMenu");
        },

        isSideMenuOn: function() {
            var menu = jq('#menu');
            return this.isSideMenuEnabled() && (menu.hasClass("on") || menu.hasClass("to-on"));
        },


        update_footer_elements: function(elements) {
            var footer_nav = jq("#navbar");
            if (elements === undefined || elements == null)
                return;
            if (typeof (elements) == "string")
                return footer_nav.html(elements, true), null;
            footer_nav.html("");
            for (var i = 0; i < elements.length; i++) {
                var node = elements[i].cloneNode(true);
                footer_nav.append(node);
            }
            var tmpAnchors = jq("#navbar a");
            if (tmpAnchors.length > 0)
                tmpAnchors.data("ignore-pressed", "true").data("resetHistory", "true");
        },

        updateHeaderElements: function(elements) {
            var header_nav = jq("#header");
            if (elements === undefined || elements == null)
                return;
            if (typeof (elements) == "string")
                return header_nav.html(elements, true), null;
            header_nav.html("");
            for (var i = 0; i < elements.length; i++) {
                var node = elements[i].cloneNode(true);
                header_nav.append(node);
            }
        },

        updateSideMenu: function(elements) {
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
                close.onclick = function() {
                    that.toggleSideMenu(false);
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
            this.scrollingDivs['menu_scroller'].hideScrollbars();
            this.scrollingDivs['menu_scroller'].scrollToTop();
        },

        setTitle: function(val) {
            jq("#header #pageTitle").html(val);
        },

        setBackButtonText: function(text) {
            if (this.backButtonText.length > 0)
                jq("#header #backButton").html(this.backButtonText);
            else
                jq("#header #backButton").html(text);
        },

        setBackButtonVisibility: function(show) {
            if (!show)
                jq("#header #backButton").css("visibility", "hidden");
            else
                jq("#header #backButton").css("visibility", "visible");
        },

        show_loading_mask: function(text) {
            if (!text)
                text = "Loading Content";
            jq("#jQui_mask>h1").html(text);
            jq("#jQui_mask").show()
        },

        hide_loading_mask: function() {
            jq("#jQui_mask").hide()
        },

        showModal: function(id) {
            var that = this;
            id="#"+id.replace("#","");
            try {
                if (jq(id)) {
                    jq("#modalContainer").html($.feat.nativeTouchScroll ? jq(id).html() : jq(id).get(0).childNodes[0].innerHTML + '', true);
                    jq('#modalContainer').append("<a href='javascript:;' onclick='$.ui.hideModal();' class='closebutton modalbutton'></a>");
                    this.modal_window.style.display = "block";

                    button = null;
                    content_string = null;
                    this.scrollingDivs['modal_container'].enable(that.reset_scrollers);
                    this.scrollToTop('modal');
                     jq("#modalContainer").data("panel",id);
                }
            } catch (e) {
                console.log("Error with modal - " + e, this.modal_window);
            }
        },

        hideModal: function() {
            $("#modalContainer").html("", true);
            jq("#jQui_modal").hide()

            this.scrollingDivs['modal_container'].disable();

            var tmp=$($("#modalContainer").data("panel"));
            var fnc = tmp.data("unload");
            if (typeof fnc == "string" && window[fnc]) {
                window[fnc](tmp.get(0));
            }
            tmp.trigger("unloadpanel");

        },

        updateContentDiv: function(id, content_string) {
            id="#"+id.replace("#","");
            var element = jq(id).get(0);
            if (!element)
                return;

            var newDiv = document.createElement("div");
            newDiv.innerHTML = content_string;
            if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0)
                newDiv = $(newDiv).children('.panel').get();



            if (element.getAttribute("js-scrolling") && element.getAttribute("js-scrolling").toLowerCase() == "yes") {
                $.cleanUpContent(element.childNodes[0], false, true);
                element.childNodes[0].innerHTML = content_string;
            } else {
                $.cleanUpContent(element, false, true);
                element.innerHTML = content_string;
            }
            if ($(newDiv).title)
                element.title = $(newDiv).title;
        },
        /**
         * Dynamically create a new panel on the fly.  It wires events, creates the scroller, applies Android fixes, etc.
           ```
           $.ui.addContentDiv("myDiv","This is the new content","Title");
           ```
         * @param {String|Object} Element to add
         * @param {String} Content
         * @param {String} title
         * @title $.ui.addContentDiv(id,content_string,title);
         */
        addContentDiv: function(element, content_string, title, refresh, refreshFunc) {
            element = typeof (element) !== "string" ? element : element.indexOf("#") == -1 ? "#" + element : element;
            var myEl = jq(element).get(0);
            if (!myEl) {
                var newDiv = document.createElement("div");
                newDiv.innerHTML = content_string;
                if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0)
                    newDiv = $(newDiv).children('.panel').get();

                if (!newDiv.title && title)
                    newDiv.title = title;
                var newId = (newDiv.id) ? newDiv.id : element.replace("#",""); //figure out the new id - either the id from the loaded div.panel or the crc32 hash
                newDiv.id = newId;
                if (newDiv.id != element)
                    newDiv.setAttribute("data-crc", element.replace("#",""));
            } else {
                newDiv = myEl;
            }
            newDiv.className = "panel";
            newId=newDiv.id;
            this.addDivAndScroll(newDiv, refresh, refreshFunc);
            myEl = null;
            newDiv = null;
            return newId;
        },
        /**
         *  Takes a div and sets up scrolling for it..
           ```
           $.ui.addDivAndScroll(object);
           ```
         * @param {Object} Element
         * @title $.ui.addDivAndScroll(element);
         * @api private
         */
        addDivAndScroll: function(tmp, refreshPull, refreshFunc, container) {
            var jsScroll = false;
            var overflowStyle = tmp.style.overflow;
            var hasScroll = overflowStyle != 'hidden' && overflowStyle != 'visible';

            container = container || this.content_string;
            //sets up scroll when required and not supported
            if (!$.feat.nativeTouchScroll && hasScroll)
                tmp.setAttribute("js-scrolling", "yes");

            if (tmp.getAttribute("js-scrolling") && tmp.getAttribute("js-scrolling").toLowerCase() == "yes") {
                jsScroll = true;
                hasScroll = true;
            }



            if (tmp.getAttribute("scrolling") && tmp.getAttribute("scrolling") == "no") {
                hasScroll = false;
                jsScroll = false;
                tmp.removeAttribute("js-scrolling");
            }

            if (!jsScroll) {
                container.appendChild(tmp);
                var scrollEl = tmp;
                tmp.style['-webkit-overflow-scrolling'] = "none"
            } else {
                //WE need to clone the div so we keep events
                var scrollEl = tmp.cloneNode(false);


                tmp.title = null;
                tmp.id = null;
                tmp.removeAttribute("data-footer");
                tmp.removeAttribute("data-nav");
                tmp.removeAttribute("data-header");
                tmp.removeAttribute("selected");
                tmp.removeAttribute("data-load");
                tmp.removeAttribute("data-unload");
                tmp.removeAttribute("data-tab");
                jq(tmp).replaceClass("panel", "jqmScrollPanel");

                scrollEl.appendChild(tmp);

                container.appendChild(scrollEl);

                if (this.select_box !== false)
                    this.select_box.getOldSelects(scrollEl.id);
                if (this.password_box !== false)
                    this.password_box.getOldPasswords(scrollEl.id);

            }

            if (hasScroll) {
                this.scrollingDivs[scrollEl.id] = (jq(tmp).scroller({
                    scrollBars: true,
                    verticalScroll: true,
                    horizontalScroll: false,
                    vScrollCSS: "jqmScrollbar",
                    refresh: refreshPull,
                    useJsScroll: jsScroll,
                    noParent: !jsScroll,
                    autoEnable: false //dont enable the events unnecessarily
                }));
                //backwards compatibility
                if (refreshFunc)
                    $.bind(this.scrollingDivs[scrollEl.id], 'refresh-release', function(trigger) {
                        if (trigger)
                            refreshFunc()
                    });
            }

            tmp = null;
            scrollEl = null;
        },


        scrollToTop: function(id) {
            if (this.scrollingDivs[id]) {
                this.scrollingDivs[id].scrollToTop("300ms");
            }
        },
        scrollToBottom: function(id) {
            if (this.scrollingDivs[id]) {
                this.scrollingDivs[id].scrollToBottom("300ms");
            }
        },

        /**
         *  This is used when a transition fires to do helper events.  We check to see if we need to change the nav menus, footer, and fire
         * the load/onload functions for panels
           ```
           $.ui.parsePanelFunctions(currentDiv,old_div);
           ```
         * @param {Object} current div
         * @param {Object} old div
         * @title $.ui.parsePanelFunctions(currentDiv,old_div);
         * @api private
         */
        parsePanelFunctions: function(what, old_div) {
            //check for custom footer
            var that = this;
            var hasFooter = what.getAttribute("data-footer");
            var hasHeader = what.getAttribute("data-header");

            //$asap removed since animations are fixed in css3animate
            if (hasFooter && hasFooter.toLowerCase() == "none") {
                that.toggleNavMenu(false);
            } else {
                that.toggleNavMenu(true);
            }
            if (hasFooter && that.custom_footer != hasFooter) {
                that.custom_footer = hasFooter;
                that.update_footer_elements(jq("#" + hasFooter).children());
            } else if (hasFooter != that.custom_footer) {
                if (that.custom_footer)
                    that.update_footer_elements(that.default_footer);
                that.custom_footer = false;
            }
            if (hasHeader && hasHeader.toLowerCase() == "none") {
                that.toggleHeaderMenu(false);
            } else {
                that.toggleHeaderMenu(true);
            }

            if (hasHeader && that.customHeader != hasHeader) {
                that.customHeader = hasHeader;
                that.updateHeaderElements(jq("#" + hasHeader).children());
            } else if (hasHeader != that.customHeader) {
                if (that.customHeader) {
                    that.updateHeaderElements(that.default_header);
                    that.setTitle(that.active_div.title);
                }
                that.customHeader = false;
            }
            if (what.getAttribute("data-tab")) { //Allow the dev to force the footer menu
                jq("#navbar a").removeClass("selected");
                jq("#" + what.getAttribute("data-tab")).addClass("selected");
            }

            //Load inline footers
            var inlineFooters = $(what).find("footer");
            if (inlineFooters.length > 0) {
                that.custom_footer = what.id;
                that.update_footer_elements(inlineFooters.children());
            }
            //load inline headers
            var inlineHeader = $(what).find("header");


            if (inlineHeader.length > 0) {
                that.customHeader = what.id;
                that.updateHeaderElements(inlineHeader.children());
            }
            //check if the panel has a footer
            if (what.getAttribute("data-tab")) { //Allow the dev to force the footer menu
                jq("#navbar a").removeClass("selected");
                jq("#navbar #" + what.getAttribute("data-tab")).addClass("selected");
            }

            var hasMenu = what.getAttribute("data-nav");
            if (hasMenu && this.custom_menu != hasMenu) {
                this.custom_menu = hasMenu;
                this.updateSideMenu(jq("#" + hasMenu).children());
            } else if (hasMenu != this.custom_menu) {
                if (this.custom_menu) {
                    this.updateSideMenu(this.default_menu);
                }
                this.custom_menu = false;
            }



            if (old_div) {
                fnc = old_div.getAttribute("data-unload");
                if (typeof fnc == "string" && window[fnc]) {
                    window[fnc](old_div);
                }
                $(old_div).trigger("unloadpanel");
            }
            var fnc = what.getAttribute("data-load");
            if (typeof fnc == "string" && window[fnc]) {
                window[fnc](what);
            }
            $(what).trigger("loadpanel");
            if (this.isSideMenuOn()) {
                this.toggleSideMenu(false);
            }
        },

        //Helper function that parses a contents html for any script tags and either adds them or executes the code
        parseScriptTags: function(div) {
            if (!div)
                return;
            $.parseJS(div);
        },
        /**
         * This is called to initiate a transition or load content via ajax.
         * We can pass in a hash+id or URL and then we parse the panel for additional functions
           ```
           $.ui.loadContent("#main",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadContent(target,newTab,go_back,transition);
         * @api public
         */
        loadContent: function(target, newTab, back, transition, anchor) {

            if (this.doing_transition) {
                var that = this;
                this.loadContentQueue.push([target, newTab, back, transition, anchor]);
                return
            }
            if (target.length === 0)
                return;

            var what = null;
            var that = this;
            var loadAjax = true;
            anchor = anchor || document.createElement("a"); //Hack to allow passing in no anchor
            if (target.indexOf("#") == -1) {
                var urlHash = "url" + crc32(target); //Ajax urls
                var crcCheck = jq("div.panel[data-crc='" + urlHash + "']");
                if (jq("#" + target).length > 0) {
                    loadAjax = false;
                }
                else if (crcCheck.length > 0) {
                    loadAjax = false;
                    if (anchor.getAttribute("data-refresh-ajax") === 'true' || (anchor.refresh && anchor.refresh === true || this.isAjaxApp)) {
                        loadAjax = true;
                    }
                    else {
                        target = "#" + crcCheck.get(0).id;
                    }
                } else if (jq("#" + urlHash).length > 0) {

                    //ajax div already exists.  Let's see if we should be refreshing it.
                    loadAjax = false;
                    if (anchor.getAttribute("data-refresh-ajax") === 'true' || (anchor.refresh && anchor.refresh === true || this.isAjaxApp)) {
                        loadAjax = true;
                    } else
                        target = "#" + urlHash;
                }
            }
            if (target.indexOf("#") == -1 && loadAjax) {
                this.loadAjax(target, newTab, back, transition, anchor);
            } else {
                this.loadDiv(target, newTab, back, transition);
            }
        },
        /**
         * This is called internally by loadContent.  Here we are loading a div instead of an Ajax link
           ```
           $.ui.loadDiv("#main",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadDiv(target,newTab,go_back,transition);
         * @api private
         */
        loadDiv: function(target, newTab, back, transition) {
            // load a div
            var that=this;
            what = target.replace("#", "");

            var slashIndex = what.indexOf('/');
            var hashLink = "";
            if (slashIndex != -1) {
                // Ignore everything after the slash for loading
                hashLink = what.substr(slashIndex);
                what = what.substr(0, slashIndex);
            }

            what = jq("#" + what).get(0);

            if (!what)
                return console.log ("Target: " + target + " was not found");
            if (what == this.active_div && !back) {
                //toggle the menu if applicable
                if (this.isSideMenuOn())
                    this.toggleSideMenu(false);
                return;
            }
            this.transition_effect = transition;
            var old_div = this.active_div;
            var currWhat = what;

            if (what.getAttribute("data-modal") == "true" || what.getAttribute("modal") == "true") {
                var fnc = what.getAttribute("data-load");
                if (typeof fnc == "string" && window[fnc]) {
                    window[fnc](what);
                }
                $(what).trigger("loadpanel");
                return this.showModal(what.id);
            }




            if (old_div == currWhat) //prevent it from going to itself
                return;

            if (newTab) {
                this.clear_history();
                this.pushHistory("#" + this.firstDiv.id, what.id, transition, hashLink);
            } else if (!back) {
                this.pushHistory(previous_target, what.id, transition, hashLink);
            }


            previous_target = '#' + what.id + hashLink;


            this.doing_transition = true;

            old_div.style.display="block";
            currWhat.style.display="block";

            this.runTransition(transition, old_div, currWhat, back);


            //Let's check if it has a function to run to update the data
            this.parsePanelFunctions(what, old_div);
            //Need to call after parsePanelFunctions, since new headers can override
            this.loadContentData(what, newTab, back, transition);
            var that=this;
            setTimeout(function(){
                if(that.scrollingDivs[old_div.id]) {
                    that.scrollingDivs[old_div.id].disable();
                }
            },200);

        },
        /**
         * This is called internally by loadDiv.  This sets up the back button in the header and scroller for the panel
           ```
           $.ui.loadContentData("#main",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadDiv(target,newTab,go_back,transition);
         * @api private
         */
        loadContentData: function(what, newTab, back, transition) {
            if (back) {
                if (this.history.length > 0) {
                    var val = this.history[this.history.length - 1];
                    var slashIndex = val.target.indexOf('/');
                    if (slashIndex != -1) {
                        var prevId = val.target.substr(0, slashIndex);
                    } else
                        var prevId = val.target;
                    var element = jq(prevId).get(0);
                    //make sure panel is there
                    if (element)
                        this.setBackButtonText(element.title);
                    else
                        this.setBackButtonText("Back");
                }
            } else if (this.active_div.title)
                this.setBackButtonText(this.active_div.title)
            else
                this.setBackButtonText("Back");
            if (what.title) {
                this.setTitle(what.title);
            }
            if (newTab) {
                this.setBackButtonText(this.firstDiv.title)
            }

            if (this.history.length == 0) {
                this.setBackButtonVisibility(false);
                this.history = [];
            } else if (this.showBackbutton)
                this.setBackButtonVisibility(true);
            this.active_div = what;
            if (this.scrollingDivs[this.active_div.id]) {
                this.scrollingDivs[this.active_div.id].enable(this.reset_scrollers);
            }
        },
        /**
         * This is called internally by loadContent.  Here we are using Ajax to fetch the data
           ```
           $.ui.loadDiv("page.html",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadDiv(target,newTab,go_back,transition);
         * @api private
         */
        loadAjax: function(target, newTab, back, transition, anchor) {
            // XML Request
            if (this.active_div.id == "jQui_ajax" && target == this.ajax_url)
                return;
            var urlHash = "url" + crc32(target); //Ajax urls
            var that = this;
            if (target.indexOf("http") == -1)
                target = AppMobi.webRoot + target;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    this.doing_transition = false;

                    var doReturn = false;

                    //Here we check to see if we are retaining the div, if so update it
                    if (jq("#" + urlHash).length > 0) {
                        that.updateContentDiv(urlHash, xmlhttp.responseText);
                        jq("#" + urlHash).get(0).title = anchor.title ? anchor.title : target;
                    } else if (anchor.getAttribute("data-persist-ajax") || that.isAjaxApp) {

                        var refresh = (anchor.getAttribute("data-pull-scroller") === 'true') ? true : false;
                        refreshFunction = refresh ?
                        function() {
                            anchor.refresh = true;
                            that.loadContent(target, newTab, back, transition, anchor);
                            anchor.refresh = false;
                        } : null;
                        //that.addContentDiv(urlHash, xmlhttp.responseText, refresh, refreshFunction);
                        urlHash = that.addContentDiv(urlHash, xmlhttp.responseText, anchor.title ? anchor.title : target, refresh, refreshFunction);
                    } else {

                        that.updateContentDiv("jQui_ajax", xmlhttp.responseText);
                        jq("#jQui_ajax").get(0).title = anchor.title ? anchor.title : target;
                        that.loadContent("#jQui_ajax", newTab, back);
                      console.log('im in here');
                        doReturn = true;
                    }
                    //Let's load the content now.
                    //We need to check for any script tags and handle them
                    var div = document.createElement("div");
                    div.innerHTML = xmlhttp.responseText;
                    that.parseScriptTags(div);

                    if (doReturn)
                    {
                         if (that.show_loading)
                            that.hide_loading_mask();
                        return;
                    }

                    that.loadContent("#" + urlHash);
                    if (that.show_loading)
                       that.hide_loading_mask();
                    return null;
                }
            };
            ajax_url = target;
            var newtarget = this.useAjaxCacheBuster ? target + (target.split('?')[1] ? '&' : '?') + "cache=" + Math.random() * 10000000000000000 : target;
            xmlhttp.open("GET", newtarget, true);
            xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xmlhttp.send();
            // show Ajax Mask
            if (this.show_loading)
                this.show_loading_mask();
        },

        runTransition: function(transition, old_div, current_div, back) {
            if (!this.availableTransitions[transition])
                transition = 'default';
            this.availableTransitions[transition].call(this, old_div, current_div, back);
        },

        //This is called when you want to launch jqUi.  If autoLaunch is set to true, it gets called on DOMContentLoaded.
        //If autoLaunch is set to false, you can manually invoke it.
        launch: function() {

            if (this.has_launched == false || this.launch_completed) {
                this.has_launched = true;
                return;
            }

            var that = this;

            console.log(that);
            //that is just the $.ui object which loads only once

            this.isAppMobi = (window.AppMobi && typeof (AppMobi) == "object" && AppMobi.app !== undefined) ? true : false;
            this.viewport_container = jq("#jQUi");
            this.navbar = jq("#navbar").get(0);
            this.content_string = jq("#content").get(0);
            this.header = jq("#header").get(0);
            this.menu = jq("#menu").get(0);
            //set anchor click handler for UI
            this.viewport_container[0].addEventListener('click', function(e) {
                var theTarget = e.target;
                checkAnchorClick(e, theTarget);
            }, false);


            //enter-edit scroll paddings fix
            //focus scroll adjust fix
            var enterEditEl = null;
            //on enter-edit keep a reference of the actioned element
            $.bind($.touch_layer, 'enter-edit', function(element) {
                enterEditEl = element;
            });
            //enter-edit-reshape panel padding and scroll adjust
            $.bind($.touch_layer, 'enter-edit-reshape', function() {
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
                        that.scrollingDivs[that.active_div.id].setPaddings(paddingTop, paddingBottom);

                    } else if ($.os.android || $.os.blackberry) {
                        var elPos = jQel.offset();
                        var containerPos = jQactive.offset();
                        if (elPos.bottom > containerPos.bottom && elPos.height < containerPos.height) {
                            //apply fix
                            that.scrollingDivs[that.active_div.id].scrollToItem(jQel, 'bottom');
                        }
                    }
                }
            });
            if ($.os.ios) {
                $.bind($.touch_layer, 'exit-edit-reshape', function() {
                    that.scrollingDivs[that.active_div.id].setPaddings(0, 0);
                });
            }

            //elements setup
            if (!this.navbar) {
                this.navbar = document.createElement("div");
                this.navbar.id = "navbar";
                this.navbar.style.cssText = "display:none";
                this.viewport_container.append(this.navbar);
            }
            if (!this.header) {
                this.header = document.createElement("div");
                this.header.id = "header";
                this.viewport_container.prepend(this.header);
            }
            if (!this.menu) {
                this.menu = document.createElement("div");
                this.menu.id = "menu";
                //this.menu.style.overflow = "hidden";
                this.menu.innerHTML = '<div id="menu_scroller"></div>';
                this.viewport_container.append(this.menu);
                this.menu.style.overflow = "hidden";
                this.scrollingDivs["menu_scroller"] = jq("#menu_scroller").scroller({
                    scrollBars: true,
                    verticalScroll: true,
                    vScrollCSS: "jqmScrollbar",
                    useJsScroll: !$.feat.nativeTouchScroll,
                    noParent: $.feat.nativeTouchScroll
                });
                if ($.feat.nativeTouchScroll)
                    $("#menu_scroller").css("height", "100%");
            }

            if (!this.content_string) {
                this.content_string = document.createElement("div");
                this.content_string.id = "content";
                this.viewport_container.append(this.content_string);
            }

            //insert backbutton (should optionally be left to developer..)
            this.header.innerHTML = '<a id="backButton"  href="javascript:;"></a> <h1 id="pageTitle"></h1>' + header.innerHTML;
            this.backButton = $("#header #backButton").get(0);
            this.backButton.className = "button";
            jq(document).on("click", "#header #backButton", function() {
                that.go_back();
            });
            this.backButton.style.visibility = "hidden";

            //page title (should optionally be left to developer..)
            this.titleBar = $("#header #pageTitle").get(0);

            //setup ajax mask
            this.addContentDiv("jQui_ajax", "");
            var maskDiv = document.createElement("div");
            maskDiv.id = "jQui_mask";
            maskDiv.className = "ui-loader";
            maskDiv.innerHTML = "<span class='ui-icon ui-icon-loading spin'></span><h1>Loading Content</h1>";
            maskDiv.style.zIndex = 20000;
            maskDiv.style.display = "none";
            document.body.appendChild(maskDiv);
            //setup modalDiv
            var modalDiv = document.createElement("div");
            modalDiv.id = "jQui_modal";
            this.viewport_container.prepend(modalDiv);
            modalDiv.appendChild(jq("<div id='modalContainer'></div>").get());
            this.scrollingDivs['modal_container'] = jq("#modalContainer").scroller({
                scrollBars: true,
                vertical: true,
                vScrollCSS: "jqmScrollbar",
                noParent: true
            });

            this.modal_window = modalDiv;
            //get first div, defer
            var defer = {};
            var contentDivs = this.viewport_container.get().querySelectorAll(".panel");
            for (var i = 0; i < contentDivs.length; i++) {
                var element = contentDivs[i];
                var tmp = element;
                var id;
                var prevSibling=element.previousSibling;
                if (element.parentNode && element.parentNode.id != "content") {

                    element.parentNode.removeChild(element);
                    id = element.id;
                    if (tmp.getAttribute("selected"))
                        this.firstDiv = jq("#" + id).get(0);
                    this.addDivAndScroll(tmp);
                    jq("#"+id).insertAfter(prevSibling);
                } else if (!element.parsedContent) {
                    element.parsedContent = 1;
                    element.parentNode.removeChild(element);
                    id = element.id;
                    if (tmp.getAttribute("selected"))
                        this.firstDiv = jq("#" + id).get(0);
                    this.addDivAndScroll(tmp);
                    jq("#"+id).insertAfter(prevSibling);
                }
                if (element.getAttribute("data-defer")) {
                    defer[id] = element.getAttribute("data-defer");
                }
                if (!this.firstDiv)
                    this.firstDiv = $("#" + id).get(0);

                element = null;
            }
            contentDivs = null;
            var loadingDefer = false;
            var toLoad = Object.keys(defer).length;
            if (toLoad > 0) {
                loadingDefer = true;
                var loaded = 0;
                for (var j in defer) {
                    (function(j) {
                        jq.ajax({
                            url: AppMobi.webRoot + defer[j],
                            success: function(data) {
                                if (data.length == 0)
                                    return;
                                $.ui.updateContentDiv(j, data);
                                that.parseScriptTags(jq(j).get());
                                loaded++;
                                if (loaded >= toLoad) {
                                    $(document).trigger("defer:loaded");
                                    loadingDefer = false;

                                }
                            },
                            error: function(msg) {
                                //still trigger the file as being loaded to not block jq.ui.ready
                                console.log("Error with deferred load " + AppMobi.webRoot + defer[j])
                                loaded++;
                                if (loaded >= toLoad) {
                                    $(document).trigger("defer:loaded");
                                    loadingDefer = false;
                                }
                            }
                        });
                    })(j);
                }
            }
            if (this.firstDiv) {

                var that = this;
                // Fix a bug in iOS where translate3d makes the content blurry
                this.active_div = this.firstDiv;

                if (this.scrollingDivs[this.active_div.id]) {
                    this.scrollingDivs[this.active_div.id].enable();
                }

                //window.setTimeout(function() {
                var load_first_div = function() {


                    if (jq("#navbar a").length > 0) {
                        jq("#navbar a").data("ignore-pressed", "true").data("resetHistory", "true");
                        that.default_footer = jq("#navbar").children().clone();
                        that.update_footer_elements(that.default_footer);
                    }
                    //setup initial menu
                    var firstMenu = jq("nav").get();
                    if (firstMenu) {
                        that.default_menu = jq(firstMenu).children().clone();
                        that.updateSideMenu(that.default_menu);
                    }
                    //get default header
                    that.default_header = jq("#header").children().clone();
                    //
                    jq("#navbar").on("click", "a", function(e) {
                        jq("#navbar a").not(this).removeClass("selected");
                            $(e.target).addClass("selected");
                    });


                    //go to active_div
                    var firstPanelId = that.get_panel_id_from_hash(default_hash);
                    //that.history=[{target:'#'+that.firstDiv.id}];   //set the first id as origin of path
                    if (firstPanelId.length > 0 && that.loadDefaultHash && firstPanelId != ("#" + that.firstDiv.id)&&$(firstPanelId).length>0) {
                        that.loadContent(default_hash, true, false, 'none'); //load the active page as a newTab with no transition
                    } else {
                        previous_target = "#" + that.firstDiv.id;
                        that.loadContentData(that.firstDiv); //load the info off the first panel
                        that.parsePanelFunctions(that.firstDiv);

                        that.firstDiv.style.display = "block";
                        $("#header #backButton").css("visibility", "hidden");
                        if (that.firstDiv.getAttribute("data-modal") == "true" || that.firstDiv.getAttribute("modal") == "true") {
                            that.showModal(that.firstDiv.id);
                        }
                    }

                    that.launch_completed = true;
                    if (jq("nav").length > 0) {
                        jq("#jQUi #header").addClass("hasMenu off");
                        jq("#jQUi #content").addClass("hasMenu off");
                        jq("#jQUi #navbar").addClass("hasMenu off");
                    }
                    //trigger ui ready
                    jq(document).trigger("jq.ui.ready");
                    //remove splash screen

                    // Run after the first div animation has been triggered - avoids flashing
                    jq("#splashscreen").remove();
                };
                if (loadingDefer) {
                    $(document).one("defer:loaded", load_first_div);
                } else
                    load_first_div();
            }
            var that = this;
            $.bind(that, "content-loaded", function() {
                if (that.loadContentQueue.length > 0) {
                    var tmp = that.loadContentQueue.splice(0, 1)[0];
                    that.loadContent(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4]);
                }
            });
            if (window.navigator.standalone) {
                this.blockPageScroll();
            }
            this.topClickScroll();

        },

        //Simulates the click and scroll to top of browser
        topClickScroll:function(){
             document.getElementById("header").addEventListener("click",function(e){
                if(e.clientY<=15&&e.target.nodeName.toLowerCase()=="h1") //hack - the title spans the whole width of the header
                    $.ui.scrollingDivs[$.ui.active_div.id].scrollToTop("100");
            });

        },

        blockPageScroll: function() {
            jq("#jQUi #header").bind("touchmove", function(e) {
                e.preventDefault();
            });
        },

        //This is the default transition.  It simply shows the new panel and hides the old
        noTransition: function(old_div, current_div, back) {
            current_div.style.display = "block";
            old_div.style.display = "block";
            var that = this;
            that.clearAnimations(current_div);
            that.css3animate(old_div, {
                x: "0%",
                y: 0
            });
            that.finishTransition(old_div);
            current_div.style.zIndex = 2;
            old_div.style.zIndex = 1;
        },

        //This must be called at the end of every transition to hide the old div and
        // reset the doing_transition variable
        finishTransition: function(old_div, current_div) {
            old_div.style.display = 'none';
            this.doing_transition = false;
            if (current_div)
                this.clearAnimations(current_div);
            if (old_div)
                this.clearAnimations(old_div);
            $.trigger(this, "content-loaded");
        },


        //This must be called at the end of every transition to remove all transforms and
        // transitions attached to the inView object (performance + native scroll)
        clearAnimations: function(in_view_div_object) {
            in_view_div_object.style[$.feat.cssPrefix + 'Transform'] = "none";
            in_view_div_object.style[$.feat.cssPrefix + 'Transition'] = "none";
        }

    /**
         * END
         * @api private
         */
    };


    //lookup for a clicked anchor recursively and fire UI own actions when applicable
    var checkAnchorClick = function(e, theTarget) {


        if (theTarget == (jQUi)) {
            return;
        }

        //this technique fails when considerable content exists inside anchor, should be recursive ?
        if (theTarget.tagName.toLowerCase() != "a" && theTarget.parentNode)
            return checkAnchorClick(e, theTarget.parentNode); //let's try the parent (recursive)
        //anchors
        if (theTarget.tagName !== "undefined" && theTarget.tagName.toLowerCase() == "a") {

            var custom = (typeof jq.ui.custom_click_handler == "function") ? jq.ui.custom_click_handler : false;
            if (custom !== false) {
                if(jq.ui.custom_click_handler(theTarget))
                   return e.preventDefault();

            }
            if (theTarget.href.toLowerCase().indexOf("javascript:") !== -1 || theTarget.getAttribute("data-ignore")) {
                return;
            }


            if (theTarget.href.indexOf("tel:") === 0)
                return false;

            //external links
            if (theTarget.hash.indexOf("#") === -1 && theTarget.target.length > 0) {
                if (theTarget.href.toLowerCase().indexOf("javascript:") != 0) {
                    if (jq.ui.isAppMobi) {
                        e.preventDefault();
                        AppMobi.device.launchExternal(theTarget.href);
                    } else if (!jq.os.desktop) {
                        e.target.target = "_blank";
                    }
                }
                return;
            }

            /* IE 10 fixes*/

            var href = theTarget.href,
            prefix = location.protocol + "//" + location.hostname+":"+location.port;
            if (href.indexOf(prefix) === 0) {
                href = href.substring(prefix.length+1);
            }
            //empty links
            if (href == "#" ||(href.indexOf("#")===href.length-1)|| (href.length == 0 && theTarget.hash.length == 0))
                return;

            //internal links
            e.preventDefault();
            var mytransition = theTarget.getAttribute("data-transition");
            var resetHistory = theTarget.getAttribute("data-resetHistory");
            resetHistory = resetHistory && resetHistory.toLowerCase() == "true" ? true : false;
            var href = theTarget.hash.length > 0 ? theTarget.hash : theTarget.href;
            jq.ui.loadContent(href, resetHistory, 0, mytransition, theTarget);
            return;
        }
    }

    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D"; /* Number */
    var crc32 = function( /* String */str,  /* Number */crc) {
        if (crc == undefined)
            crc = 0;
        var n = 0; //a number between 0 and 255
        var x = 0; //an hex number
        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            n = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = "0x" + table.substr(n * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        return crc ^ (-1);
    };


    $.ui = new ui;

})(jq);




