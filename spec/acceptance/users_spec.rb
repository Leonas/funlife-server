require 'spec_helper'
require 'rspec_api_documentation/dsl'

resource "Users" do

  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let(:email)    { "email@email.com" }
  let(:password) { "example" }
  let(:raw_post) { params.to_json }



  post "/users" do
    parameter :email,    "User email",    required: true, scope: :user
    parameter :password, "User password", required: true, scope: :user

    example_request "Creating an account" do
      explanation "User signs up with unique email and password. No header auth required."
      response_body.should include_json({

        user: {
            email: email,

            token: JSON.parse(response_body)['user']['token']
        }

      }.to_json)
      status.should == 201
    end
  end

  #put "/users" do
  #  parameter :first_name,  "First name", required: true, scope: :user
  #  parameter :last_name,   "Last name",  required: true, scope: :user
  #  parameter :gender,      "Gender",     scope: :user
  #  parameter :birthday,    "Birthday",   scope: :user
  #
  #  example_request "Complete the signup process / update a user" do
  #    explanation "A user needs to have their first and last name on file before they can view any API endpoints"
  #
  #    status.should == 204 #no content?
  #
  #  end
  #end
  #
  #
  #get "/users" do
  #  #need to make factories create 2 fake users
  #  example_request "List nearby users" do
  #    explanation "A list of users is returned based on proximity to their gps coordinates"
  #    response_body.should be_json_eql({
  #
  #      users: [
  #        {
  #          id: user1.id,
  #          full_name: user1.full_name,
  #        },
  #        {
  #          id: user2.id,
  #          full_name: user2.full_name,
  #        }
  #      ]
  #
  #  })
  #  end
  #end
  #
  #
  #get "/users/:id" do
  #  parameter :id, "id", required: true
  #  let(:id) { user.id }
  #
  #  example_request "Fetch a user's profile" do
  #    explanation "user profile"
  #    response_body.should be_json_eql({
  #    #                                     "user": {
  #    #    "id": "1",
  #    #    "name"           : "First Last",
  #    #    "photo"          : "photo_url",
  #    #    "follower_count" : "23",
  #    #    "following_count": "34",
  #    #    "status"         : "single or blank",
  #    #    "verified"       : "true",      //ribbon
  #    #"trusted"        : "false",     //ribbon
  #    #"trust"          : "false",     //do I trust this person?
  #    #"follow"         : "true",      //do I follow this person?
  #    #"feedback"       : "75",
  #    #    "invite_me" {
  #    #    "standard_activities": [
  #    #    "img_url",
  #    #    "img_url",
  #    #    "img_url"
  #    #],
  #    #    "custom_activities": "shopping, eating donuts, pool parties"
  #    #},
  #    #    "activities_completed": [
  #    #    { "img": "url", "times": "6" },
  #    #    { "img": "url", "times": "4" },
  #    #    { "img": "url", "times": "1" },
  #    #],
  #    #    "questions": [
  #    #    { "title": "introduction", "answer": "hello" },
  #    #    { "title": "enjoyment", "answer": "biking" }
  #    #]
  #    #
  #    #}
  #                                     })
  #  end
  #
  #
  #
  #end


end
