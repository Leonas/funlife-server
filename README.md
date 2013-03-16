## FunLife

[What we're all about.](https://github.com/Leonas/funlife/wiki/Introduction-to-FunLife)

Take a look at our [wiki!](https://github.com/Leonas/funlife/wiki)  


## Folder Structure

Both the backend and the app are in this repo

JS files for the app are under /public/src/

## Engineering Notes

* Efficiency and beautiful code are our goals.
* No branches - all commits must be merged to master.  
* Please add to the wiki to make it better


## Possible Development Cycle

Step 1 - Look at the app visual design - choose a page you would like to implement.

Step 2 - Write out an API that would make sense in the [FunLife API Wiki](https://github.com/Leonas/funlife/wiki/API).

Step 3 - Write controller specs for every feature of the newly written API. Simulate common user behavior.  All new tests should fail.
         Run 'bundle exec guard' to get auto reloading tests

Step 4 - Push to github "[pagename] controller specs done"

Step 5 - Write the ruby code to make all tests pass. Use Postman chrome addon to help debug requests.

Step 6 - Push to github "[pagename] controller done"

Step 7 - Create a doT template that has all of the features of the image with very basic css design.

Step 8 - Create a model if necessary. Create a controller or add the new view and route to an existing controller.

Step 9 - Write capybara (feature) tests that make sure this area of the app can be accessed. All tests should be passing.

Step 10 - Push to github "[pagename] has working js routes"

Step 11 - Write feature tests that match the json tests but use the javascript UI. These tests should be failing.

Step 12 - Push to github "[pagename] feature specs done"

Step 13 - Implement the javascript code to make all tests pass.

Step 14 - Push to github "[pagename] feature specs work"

Step 15 - Review the code, refactor, and push to github

