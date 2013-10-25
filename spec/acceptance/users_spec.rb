require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Users" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"



  ######################################
  post "/users" do #####################
  ######################################

    parameter :email,    "User email",    scope: :user, required: true
    parameter :password, "User password", scope: :user, required: true

    let(:email)    { build_user.email }
    let(:password) { build_user.password }
    let(:raw_post) { params.to_json }

    example_request "Creating an account" do
      explanation "User signs up with unique email and password. No header auth required."
      response_body.should include_json({
            email: email,
            token: JSON.parse(response_body)["user"]["token"]
      }.to_json).at_path("user")
      status.should == 201
    end
  end




  ######################################
  put "/users" do ######################
  ######################################

    header "Authorization", token
    parameter :first_name,  "First name", scope: :user, required: true
    parameter :last_name,   "Last name",  scope: :user, required: true
#    parameter :gender,      "Gender",     scope: :user
#    parameter :birthday,    "Birthday",   scope: :user

    let(:first_name) { build_user.first_name }
    let(:last_name)  { build_user.last_name }
    let(:raw_post) { params.to_json }

    example_request "Complete the signup process or update a user" do
      explanation "A user needs to have their first and last name on file before they can view any API endpoints"
      status.should == 204
    end
  end




  ######################################
  get "/users" do ######################
  ######################################

    header "Authorization", token
    parameter :longitude, "longitude", scope: :user
    parameter :latitude, "latitude",   scope: :user

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



  #breaks docs:generate aka iodocs writer because the way i have mine is it requires a scope otherwise fail
  ######################################
  get "/users/:id" do ##################
  ######################################

    header "Authorization", token
    parameter :id, "user id", required: true

    let(:user_1) { user1 }
    let(:id) { user_1.id }

    example "Fetch a user's profile" do
      explanation "user profile"

      do_request

      response_body.should include_json({
          user: {
            id: user_1.id,
            name: user_1.full_name,
            following_count: user_1.following_count,
            followers_count: user_1.followers_count
          }
      }.to_json)
    end
  end


end
