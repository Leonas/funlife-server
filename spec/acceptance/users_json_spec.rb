require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Users" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"


  let!(:user1) { @user1 = Factory.create(:user) }
  let!(:setup_users) do
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
    @built_user = Factory.build(:user)

    @user2.follow!(@user1)
    @user3.follow!(@user1)
    @user1.follow!(@user3)
    @user1.reload
    @user2.reload
    @user3.reload
  end
  let!(:token) { generate_token(@user1) }




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

    example_request "List nearby users" do
      explanation "A list of users is returned based on proximity to their gps coordinates"

      response_body.should include_json({

        users: [
          {
            id: @user2.id,
            name: @user2.name
          },
          {
            id: @user3.id,
            name: @user3.name
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

    let(:id) { @user2.id }

    example_request "Fetch a user's profile" do
      explanation "user profile"

      response_body.should include_json({
          user: {
            id: @user2.id,
            name: @user2.name,
            following_count: @user2.following_count,
            followers_count: @user2.followers_count
          }
      }.to_json)
      user = JSON.parse(response_body)['user']
      expect(user['token']).to be_nil
    end
  end




  ######################################
  get "/users/:id/followers" do ########
  ######################################

    header "Authorization", :token
    parameter :id, "user id", required: true

    let(:id) { @user1.id }

    example_request "Get list of followers" do
      explanation "Get a list of followers for user_id"
      response_body.should include_json({

          users: [
              {
                  id: @user2.id,
                  name: @user2.name
              },
              {
                  id: @user3.id,
                  name: @user3.name
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
          users: [
              id: @user3.id,
              name: @user3.name
          ]
      }.to_json)
    end
  end


  ######################################
  get "/users/:id/photos" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "User id"

    example_request "List a user's photos" do
      explanation "An array of user's photos is received"
      response_body.should include_json({

                                            photos: [
                                                {
                                                    id: xxx,
                                                    url: xxx,
                                                    date: xxx
                                                },
                                                {
                                                    id: xxx,
                                                    url: xxx,
                                                    date: xxx
                                                }
                                            ]

                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  get "/users/:id/fav_places" do #######
  ######################################

    header "Authorization", :token
    parameter :id, "user id", required: true

    let(:id) { @user1.id }

    example_request "Get a list of a user's favorite places" do
      explanation ""

      response_body.should include_json({
                                            places: [
                                                id: @place1.id,
                                                name: @place1.name
                                            ]
                                        }.to_json)
  status.should == 200
    end
  end



  ######################################
  get "/users/:id/fav_activities" do ###
  ######################################

    header "Authorization", :token
    parameter :id, "user id", required: true

    let(:id) { @user1.id }

    example_request "Get a list of a user's favorite activities" do
      explanation ""

      response_body.should include_json({
                                            places: [
                                                id: @place1.id,
                                                name: @place1.name
                                            ]
                                        }.to_json)
  status.should == 200
    end
  end


  ######################################
  get "/users/:id/invitations" do ########
  ######################################

    header "Authorization", :token
    parameter :id, "user id", required: true

    let(:id) { @user1.id }

    example_request "Get array of invites for user" do
      explanation "Get a list of followers for user_id"
      response_body.should include_json({

                                            users: [
                                                {
                                                    id: @user2.id,
                                                    name: @user2.name
                                                },
                                                {
                                                    id: @user3.id,
                                                    name: @user3.name
                                                }
                                            ]

                                        }.to_json)
    end
  end


  ######################################
  get "/users/dashboard" do #################
  ######################################

    header "Authorization", :token

    let(:id) { @user1.id }

    example_request "View dashboard" do
      explanation "Gets the current user's dashboard"

      response_body.should include_json({

                                        }.to_json)
  status.should == 200
    end
  end


end
