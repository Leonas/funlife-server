## FunLife

[What we're all about.](https://github.com/Leonas/funlife/wiki/Introduction-to-FunLife)

Take a look at our [wiki!](https://github.com/Leonas/funlife/wiki)  

Todo List:
[Asana](https://www.asana.com)

Team Chat:
[Funlife Hipchat](https://funlife.hipchat.com/invite/37167/c94b0b6ec80c64003dbb173da531ae15)

## Folder Structure

Both the backend and the app are in this repo

JS files for the app are under /public/src/

## Engineering Notes

* Be efficient! Always google before tackling a hard problem to get insights into how others have solved it.
* Write clean and easy to understand code.
* Refactor often!
* Optimize js for speed as mobile devices are quite slow.
* We are using a single branch only; merge all commits to master.
* Add useful stuff to the wiki.
* Thanks for joining on this awesome project! :)


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

