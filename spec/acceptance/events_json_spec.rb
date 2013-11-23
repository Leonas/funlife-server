






### List events on home screen feed
#[01 Home Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/01.home-screenv3.png)
#**method**: GET
#**path:** /events/feed
#
#**Response**
#
#    ```
#Status: 200 OK
#```
#
#```json
#{
#   "my_events": [
#      {
#         "id": "new_event",
#         "img": "img_url"
#      },
#      {
#         "id": "messages",
#         "img": "img_url"
#      },
#      {
#         "id": "1",
#         "img": "img_url"
#      },
#
#
#   ],
#
#   "upcoming": [
#      {
#         "day"       : "23",
#         "month"     : "aug",
#         "title"     : "Today's Events",
#         "events":
#            [
#               {
#                  "id"       : "3",
#                  "img"      : "img_url",
#                  "dist"     : "2.1mi",
#                  "time"     : "9:30pm",
#                  "attending": "5"
#               },
#               {
#                  "id"       : "4",
#                  "img"      : "img_url",
#                  "dist"     : "1.1mi",
#                  "time"     : "10:30pm",
#                  "attending": "8"
#               }
#            ]
#      },
#      {
#         "day"       : "24",
#         "month"     : "aug",
#         "title"     : "Tomorrow's Events",
#         "events":
#            [
#               {
#                  "id"       : "5",
#                  "img"      : "img_url",
#                  "dist"     : "2.1mi",
#                  "time"     : "6:30pm",
#                  "attending": "5"
#               },
#               {
#                  "id"       : "6",
#                  "img"      : "img_url",
#                  "dist"     : "1.1mi",
#                  "time"     : "7:30pm",
#                  "attending": "8"
#               }
#            ]
#      }
#   ],
#}
#```
#
#
### Fetch info for an event
#[08 Event Info Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/08.1.event.png)
#**method**: GET
#**path**: /events/:id
#
#**Response**
#
#    ```
#Status: 200 ok
#```
#
#```json
#{
#   "event": {
#      "id":1,
#      "headline"     : "Bowling @ Jupiter Lanes",
#      "icon_url"     : "url",
#      "date_time"    : "Wednesday, Nov 5 @ 6:30pm",
#      "attending"    : "13",
#      "details"      : "Lets go bowling for 2 hours during happy hour.",
#      "end_time"     : "9:30pm",
#      "area_photos"  : [ "img_url", "img_url", "img_url" ],
#      "comments": [
#         {
#            "id"     : "1",
#            "level"  : "0",                        //thread level (0 - 2)
#            "name"   : "first_name",
#            "message": "I'm excited to attend!",
#            "user_id": "3",
#            "img"    : "photo_url"
#        }
#      ]
#}
#
#```
#
### Fetch users attending for event
#[08 Event Attending Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/08.2.event.png)
#**method**: GET
#**path**: /events/:id/attending
#
#**Response**
#
#    ```
#Status: 200 ok
#```
#
#```json
#{
#   "attending":
#   [
#      {
#         "id"      : "1",
#         "name"    : "first last",
#         "img"     : "img_url",
#         "verified": "true",
#         "trusted" : "false",
#         "intro"   : "some info about me"
#      }
#   ]
#}
#```
### Create new event (part 1)
#[This screen is not drawn, but its the screen before 13.1](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/13.2.create-event-screen.png)
#**method:** POST
#**path:** /events
#**Request**
#```
#{
#   "event": {
#     "category": "basketball",
#     "address" : "423 Address Rd"
#   }
#}
#
#**Response**
#
#```
#Status: 201 Created
#```
#
#```json
#{
#   "event": {
#      "id"          : "event_id",
#      "category"    : "Basketball",
#      "address"     : "423 Address Rd",
#      "img"         : "img_url",
#      "start_hour"  : "6",        //These are most common times for such event
#                                                                             "start_minute": "30",
#                                                                                 "start_period": "pm",
#                                                                                 "end_hour"    : "9",
#                                                                                 "end_minute"  : "00",
#                                                                                 "end_period"  : "pm",
#                                                                                 "days"        : "?"        //Not sure if we should give all the data like this in api
#                                 //or have JS convert it from timestamp
#                                                                             }
#                                                                             }
#                                                                             ```
#
#
### Create new event (part 2)
#[13.2 Create Event Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/13.2.create-event-screen.png)
#**method:** PUT
#**path:** /events
#**Request**
#```
#                                                                             {
#                                                                                 "event": {
#                                                                                 "id"         : "event_id",
#                                                                                 "headline"   : "Basketball game",
#                                                                                 "details"    : "We'll be playing a game of bball near my house",
#                                                                                 "day"        : "date_stamp",
#                                                                                 "start_time" : "6:30pm",
#                                                                                 "end_time"   : "9:00pm"
#                                                                             }
#                                                                             ```
#
#**Response**
#
#```
#                                                                             Status: 204 Updated
#                                                                             ```
#
#                                                                             ```json
#                                                                             {
#                                                                                 "event" {
#                                                                                 "networks":
#                                                                                 [
#                                                                                     {
#                                                                                         "icon": "url"              //This is incomplete
#         }
#      ],
#      "contacts":
#      [
#         {
#            "id"  : "1",
#            "img" : "img_url",
#            "name": "first last"
#         }
#      ]
#   },
#
#
#```
#
### Create new event (part 3)
#[13.3 Invite Friends Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/13.3.invite-screen-v02.png)
#                                                                             **method:** PUT
#                                                                             **path:** /events
#**Request**
#```
#{
#   "event": {
#      "invited": ["id1", "id2"]
#   }
#}
#```
#
#**Response**
#
#```
#Status: 204 Updated
#```
#
### Create new event (part 4)
#[13.4 Make Public Event Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/13.3.invite-screen-v02.png)
#                                                                             **details:** everything on this page is optional
#                                                                             **method:** PUT
#                                                                             **path:** /events
#**Request**
#```
#{
#   "event": {                       //all optional
#                                                                             "allow_others"  : "true",
#                                                                                 "max_attendees" : "10",
#                                                                                 "min_age"       : "20",
#                                                                                 "max_age"       : "30",
#                                                                                 "visibility"    : "everyone",   //any combination of the following is valid:
#                                                                                                                                                           //"everyone", "women", "men", "verified", "trusted"
#                                                                             "wait_list"     : "none",       //one of: "none", "everyone", "unverified", "untrusted"
#                                                                             "cost"          : "false"
#                                                                             }
#                                                                             }
#                                                                             ```
#
#**Response**
#
#```
#                                                                             Status: 204 Updated
#                                                                             ```
#
#                                                                             ```json
#                                                                             {
#                                                                                 "event": {
#                                                                                 "id":1,
#                                                                                 "headline"     : "Bowling @ Jupiter Lanes",
#                                                                                 "icon_url"     : "url",
#                                                                                 "date_time"    : "Wednesday, Nov 5 @ 6:30pm",
#                                                                                 "attending"    : "13",
#                                                                                 "details"      : "Lets go bowling for 2 hours during happy hour.",
#                                                                                 "end_time"     : "9:30pm",
#                                                                                 "area_photos"  : [ "img_url", "img_url", "img_url" ]
#                                                                             }
#                                                                             ```
#
#
### Update an Event
#
#```
#                                                                             {}
#                                                                             ```
#
#**Response**
#
#````
#Status: 204 No Content
#```
#
### Delete an Event
#
#                                                                             request method: DELETE, path: /events/:id
#
#                                                                             ```
#Status: 204 No Content
#```