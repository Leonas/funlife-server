### Create new Friendship
#
#method: POST, path: /friendships, Input: { followind_id: 2 }
#
#**Response**
#
#```
#Status : 201 Created
#```
#
#```json
#{"friendship":
#  {"created_at":"2013-03-29T12:12:43Z",
#   "following_id": 1,
#   "friend_id":2,
#    "id":1,
#   "updated_at":"2013-03-29T12:12:43Z"
#  }
#}
#```
#
### Delete a Friendship
#
#method: DELETE, path: /friendship/:id
#
#**Response**
#
#    ```
#Status: 204 No Content
#```
#
#Reference this app for how to name the variables:
#                                           https://github.com/railstutorial/sample_app_2nd_ed