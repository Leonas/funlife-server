(function ($) {

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


  $.ui.show_modal = function (id) {
    var that = this;
    id = "#" + id.replace("#", "");
    try {
      if($(id)) {
        jq("#modalContainer").html($.feat.nativeTouchScroll ? $(id).html() : $(id).get(0).childNodes[0].innerHTML + '', true);
        $('#modalContainer').append("<a href='javascript:;' onclick='$.ui.hide_modal();' class='closebutton modalbutton'></a>");
        this.modal_window.style.display = "block";

        this.scrolling_divs['modal_container'].enable(that.reset_scrollers);
        this.scrollToTop('modal');
        $("#modalContainer").data("panel", id);
      }
    } catch (e) {
      console.log("Error with modal - " + e, this.modal_window);
    }
  };

  $.ui.hide_modal = function () {
    var modal = $("#modalContainer");
    modal.html("", true);
    $("#modal_ui").hide();

    this.scrolling_divs['modal_container'].disable();

    var tmp = $(modal.data("panel"));
    var fnc = tmp.data("unload");
    if(typeof fnc == "string" && window[fnc]) {
      window[fnc](tmp.get(0));
    }
//      tmp.trigger("unloadpanel");

  };


})(jq);