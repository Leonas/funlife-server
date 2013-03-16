


//------------------------------------------------
//An example controller to show how to make one
//------------------------------------------------




$.mvc.controller.create("foo",
    {
      views: {"main_tpl": "views/main.tpl", "item_tpl": "views/item.tpl"},
      init: function () {
        $("#main").html($.template("main_tpl")); //Load the main template
        //Now we will wire events for save cancel
        $("#save_btn").bind("click", function (evt) {
          $.mvc.route("/todo/save");
        });
        $("#cancel_btn").bind("click", function (evt) {
          $("#todo_text").val("");
        });
      },
      default: function () {
        //todo_model is an instace of the Todo model.  We will get all of them and then list them
        var items = todo_model.getAll(function (items) {
          //Filter active items
          var active = items.filter(function (obj) {
            return obj.archive !== true;
          });
          //Filter archived items
          var archived = items.filter(function (obj) {
            return obj.archive == true;
          });
          //Loop through the active items and put them in the DOM
          active.forEach(function (theItem) {
            $("#active").append($.template("item_tpl", {item: theItem}));
          });
          //Loop through the archived items and put them in the DOM
          archived.forEach(function (theItem) {
            $("#archived").append($.template("item_tpl", {item: theItem}));
          });
        });
      },
      save: function () {
        //create a new object
        var item = new Todo();
        //set active to true
        todo.active = true;
        //Call save.  it is asynchronous, so we execute a callback after it's finished.  We will add it to the dom
        todo.save(function (theItem) {
          $("#active").append($.template("item_tpl", {item: theItem}));
        });
      },
      finish: function (id, active) {
        var todo = todo_model.get(id, function (item) {
          item.active = active;
          item.save(function () {
            //Let's move it to the correct list
            if (active)
              $("#active").append("#" + id + "_item");
            else
              $("#archived").append("#" + id + "_item");
          });
        });
      },
      delete: function (id) {
        var todo = todo_model.remove(id, function (item) {
          //Let's remove the item from the DOM now
          $("#" + id + "_item").remove();
        });
      }
    }
);