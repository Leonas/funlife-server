### Retrieve a list of the Current user's photos
#
#method: GET, path: /photos
#
#**Response**
#
#```
#Status: 200 ok
#```
#
#```json
#{"photos":[
#  {
#  "id":1,
#  "public_id"    : "MyString",
#  "version"      : "MyString",
#  "signature"    : "MyString",
#  "width"        : "MyString",
#  "height"       : "MyString",
#  "format"       : "MyString",
#  "resource_type": "MyString",
#  "bytes"        : "MyString",
#  "type"         : "",
#  "url"          :"MyString",
#  "secure_url"   :"MyString"
#  }
#]}
#```
#
### Retrieve a list of the following photos
#
#method: GET, path: /photos/following
#
#**Response**
#
#    ```
#Status: 200 ok
#```
#
#```json
#{"photos":[
#  {
#  "id":1,
#  "public_id":"MyString",
#  "version":"MyString",
#  "signature":"MyString",
#  "width":"MyString",
#  "height":"MyString",
#  "format":"MyString",
#  "resource_type":"MyString",
#  "bytes":"MyString",
#  "type":"",
#  "url":"MyString",
#  "secure_url":"MyString"
#  }
#]}
#```
#
### Retrieve a list of all photos (Exploring)
#
#method: GET, path: /photos/explore
#
#**Response**
#
#    ```
#Status: 200 ok
#```
#
#```json
#{"photos":[
#  {
#  "id":1,
#  "public_id":"MyString",
#  "version":"MyString",
#  "signature":"MyString",
#  "width":"MyString",
#  "height":"MyString",
#  "format":"MyString",
#  "resource_type":"MyString",
#  "bytes":"MyString",
#  "type":"",
#  "url":"MyString",
#  "secure_url":"MyString"
#  }
#]}
#```
#
#
### Retrive a Single Photo
#
#method: GET, path: /photos/:id
#
#```
#Status: 200 ok
#```
#
#```json
#
#{"photo":{
#  "id":1,
#  "public_id":"MyString",
#  "version":"MyString",
#  "signature":"MyString",
#  "width":"MyString",
#  "height":"MyString",
#  "format":"MyString",
#  "resource_type":"MyString",
#  "bytes":"MyString",
#  "type":"",
#  "url":"MyString",
#  "secure_url": "MyString"
#}
#```
#
### Create a Photo
#
#method: POST, path: /photos, input:
#  {
#  "id"           :1,
#  "public_id"    : "MyString",
#  "version"      : "MyString",
#  "signature"    : "MyString",
#  "width"        : "MyString",
#  "height"       : "MyString",
#  "format"       : "MyString",
#  "resource_type": "MyString",
#  "bytes"        : "MyString",
#  "type"         : "",
#  "url"          :"MyString",
#  "secure_url"   :"MyString"
#  }
#
#**Info:** the only photo type valid is ProfilePhoto, by default is null
#
#```
#Status: 201 created
#```
#
#```json
#
#{"photo":{
#  "id":1,
#  "public_id":"MyString",
#  "version":"MyString",
#  "signature":"MyString",
#  "width":"MyString",
#  "height":"MyString",
#  "format":"MyString",
#  "resource_type":"MyString",
#  "bytes":"MyString",
#  "type":"",
#  "url":"MyString",
#  "secure_url": "MyString"
#}
#```
#
### Delete a Photo
#
#method: DELETE, path: /photos/:id
#
#**Response**
#
#    ```
#Status: 204 No content
#```