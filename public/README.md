### FunLife App

The funlife html5 frontend app lives here.

Some folders and js files are numbered as their load order is important.
It was determined that its faster to determine load order in this simple way rather than use
require.js loading.

## Todo

### Package for Trigger.io or PhoneGap
* Use Grunt to automate this process
* Use DoT compiler to compile views
* Minify all js files including compiled views
* Generate a minified html file that is modified? see below

The html file and javascript for importing views needs to be changed.
This needs to make sure all views are loaded instantly instead of following
the code of the mvc core. Probably update everything to just have instant loading of views.
We could also use Grunt's watch command and use even the compiled versions of
the views for development. This is probably the best way.

Even though the js views are loaded, the pages are not in the DOM, thus not slowing down
the phones.
