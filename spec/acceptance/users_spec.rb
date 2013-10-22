require 'spec_helper'
require 'rspec_api_documentation/dsl'
require 'database_cleaner'

resource "Users" do

  header "Accept", "application/json"
  header "Content-Type", "application/json"


  ######################################start
  post "/users" do

    parameter :email,    "User email",    scope: :user, required: true
    parameter :password, "User password", scope: :user, required: true

    let(:email)    { build_user.email }
    let(:password) { build_user.password }
    let(:raw_post) { params.to_json }

    example "Creating an account" do
      explanation "User signs up with unique email and password. No header auth required."

      do_request
      response_body.should include_json({

            email: email,
            token: JSON.parse(response_body)["user"]["token"]

      }.to_json).at_path("user")

      status.should == 201
    end
  end
  ######################################end


  ######################################start
  put "/users" do

    parameter :first_name,  "First name", scope: :user, required: true
    parameter :last_name,   "Last name",  scope: :user, required: true
#    parameter :gender,      "Gender",     scope: :user
#    parameter :birthday,    "Birthday",   scope: :user


    header "Authorization", token

    let(:first_name) { build_user.first_name }
    let(:last_name)  { build_user.last_name }


    let(:raw_post) { params.to_json }

    example_request "Complete the signup process or update a user" do
      explanation "A user needs to have their first and last name on file before they can view any API endpoints"

      status.should == 204

    end
  end
  ######################################end


  get "/users" do

    header "Authorization", token

    example "List nearby users" do
      explanation "A list of users is returned based on proximity to their gps coordinates"

      @user2 = user2
      @user3 = user3
      do_request
      response_body.should include_json({

        users: [
          {
            id: @user2.id,
            name: @user2.full_name
          },
          {
            id: @user3.id,
            name: @user3.full_name
          }
        ]

    }.to_json)
    end
  end
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
