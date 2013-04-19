require 'spec_helper'

=begin

Create new user (register step 1)
0.2.register-step2

details: NO AUTH REQUIRED
method: POST
path: "/users"
Request

{
   "user": {
       "email"   : "email@email.com",
       "password": "password"
   }
}

Response

Status: 201 CREATED
{
   "user": {
       "id": "1",
       "first_name": "First",
       "full_name" : "First Last",
       "email"     : "email@email.com",
       "token"     : "MyToken"
   }
}

=end


#post to: '/user', data: FactoryGirl.build(user(:email, :password))
#response.should be


describe UserSerializer do

end