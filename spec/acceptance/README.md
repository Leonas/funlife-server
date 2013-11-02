##Specs

Only this code will make the variables available for testing (check conversation_json_spec):
``ruby
let!(:something) do
   #stuff here
end
``


## Authentication

A Base64 encoded token is required in headers at every endpoint except for login and register.

JavaScript example:
```js
$.ajax({
      type    : 'GET',
      dataType: 'application/json',
      headers : { 'Authorization': current_user.token },
    });
```

Ruby example:

```ruby
request.env['HTTP_AUTHORIZATION'] = "Basic " + Base64::encode64("#{current_user.token}:me")
```

## Location

ToDo:
Longitude and Latitude of each request should be included in the headers so we can provide information based on distance to user.

If no location header is provided, location will be determined by IP.

##General Info

* JSON has to always be in double quotes.
* All options are required when doing POST unless explicitly stated 'optional'