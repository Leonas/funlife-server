require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Users" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let(:setup_users) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
    @built_user = Factory.build(:user)
  end
  let(:token) { login_user(@user1) }




  ######################################
  post "/users" do #####################
  ######################################

    parameter :email,    "User email",    scope: :user, required: true
    parameter :password, "User password", scope: :user, required: true

    let(:email)    { @built_user.email }
    let(:password) { @built_user.password }
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

    header "Authorization", :token
    parameter :first_name,  "First name", scope: :user, required: true
    parameter :last_name,   "Last name",  scope: :user, required: true
#    parameter :gender,      "Gender",     scope: :user
#    parameter :birthday,    "Birthday",   scope: :user


    let(:first_name) { @built_user.first_name }
    let(:last_name)  { @built_user.last_name }
    let(:raw_post)   { params.to_json }

    example_request "Complete the signup process or update a user" do
      explanation "A user needs to have their first and last name on file before they can view any API endpoints"

      status.should == 204
    end
  end




  ######################################
  get "/users" do ######################
  ######################################

    header "Authorization", :token
    parameter :longitude, "longitude", scope: :user
    parameter :latitude, "latitude",   scope: :user

    #let(:longitude) {}
    #let(:latitude)  {}

    example "List nearby users" do
      explanation "A list of users is returned based on proximity to their gps coordinates"

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

    header "Authorization", :token
    parameter :id, "user id", required: true

    let(:id) { @user1.id }

    example_request "Fetch a user's profile" do
      explanation "user profile"

      response_body.should include_json({
          user: {
            id: @user1.id,
            name: @user1.full_name,
            following_count: @user1.following_count,
            followers_count: @user1.followers_count
          }
      }.to_json)
    end
  end




  ######################################
  get "/users/:id/followers" do ########
  ######################################

    header "Authorization", :token
    parameter :id, "user id", required: true

    example "Get list of followers" do
      explanation "Get a list of followers for user_id"

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




  ######################################
  get "/users/:id/following" do ########
  ######################################

    header "Authorization", :token
    parameter :id, "user id", required: true

    let(:id) { @user1.id }

    example_request "Get list of people user_id follows" do
      explanation ""

      response_body.should include_json({
          user: {
              id: @user1.id,
              name: @user1.full_name,
              following_count: @user1.following_count,
              followers_count: @user1.followers_count
          }
      }.to_json)
    end
  end
end
