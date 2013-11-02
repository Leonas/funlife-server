### List all places nearby
#[Used on 05 Map Screen (not including bottom)](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/05.activity-ideas-screen.png)
#**request method:** GET, **path:** /places/
#
#**Response**
#
#    ```
#Status: 200 OK
#```
#
#```json
#{
#  "places": [
#    {
#      "id": "1",
#      "icon_url": "/biking.png",
#      "lon": "-23.2342",
#      "lat": "32.1232"
#    }
#  ]
#}
#```
#
### Fetch a summary
#[Used on 05 Map Screen (bottom)](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/05.activity-ideas-screen.png)
#**method:** GET, **path:** /places/:id/summary
#**Response**
#
#    ```
#Status: 200 OK
#```
#
#```json
# { "place":
#     {
#      "id": "1",
#      "title": "Lake Bike Trail",
#      "activities": "Biking, Hiking, Camping, Fishing",
#      "distance": "4.5",
#      "rating": "2"
#     }
#  }
#```
#
### Fetch place info
#[Used on 06 Location Details Screen](https://github.com/Leonas/funlife/blob/master/graphics/app_screens/06.location-screen.png)
#**method:** GET, **path:** /places/:id
#**Response**
#
#    ```
#Status: 200 OK
#```
#
#```json
# { "place":
#     {
#      "todo":"todo"
#     }
#  }
#```
#
#
### Fetch place photos
#**method:** GET, **path:** /places/:id/photos
#**Response**
#
#    ```
#Status: 200 OK
#```
#
#```json
# { "place":
#     {
#      "todo":"todo"
#     }
#  }
#```