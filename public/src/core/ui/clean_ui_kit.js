(function($){

  //make these into functions for creating a modal div
  //it shouldnt be in the dom if its not needed

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
//  modalDiv.appendChild(jq("<div id='modalContainer'></div>").get());
//  this.scrolling_divs['modal_container'] = jq("#modalContainer").scroller({
//    scrollBars: true,
//    vertical: true,
//    vScrollCSS: "jqmScrollbar",
//    noParent: true
//  });
//  this.modal_window = modalDiv;

//  //If there is no menu, make one
//  if (!this.menu) {
//    this.menu = document.createElement("div");
//    this.menu.id = "menu";
//    this.menu.innerHTML = '<div id="menu_scroller"></div>';
//    this.ui_kit_container.append(this.menu);
//    this.menu.style.overflow = "hidden";
//    this.scrolling_divs["menu_scroller"] = jq("#menu_scroller").scroller({
//      scrollBars: true,
//      verticalScroll: true,
//      vScrollCSS: "jqmScrollbar",
//      useJsScroll: !$.feat.nativeTouchScroll,
//      noParent: $.feat.nativeTouchScroll
//    });
//    if ($.feat.nativeTouchScroll)
//      $("#menu_scroller").css("height", "100%");
//  }


})(jq);