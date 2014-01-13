require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Places" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:setup_places) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @place1 = Factory.create(:place)
    @place2 = Factory.create(:place)
  end
  let!(:token) { generate_token(@user1) }


  ######################################
  get "/places" do #####################
  ######################################

    parameter :longitude,  "Longitude"   #if not here take from user
    parameter :latitude,   "Latitude"
    parameter :activities, "Activity"
    parameter :categories, "Category"

    let(:longitude) { Faker::Address.longitude }
    let(:latitude)  { Faker::Address.latitude }

    example_request "Get a list of nearby places" do
      explanation "All places sorted by distance to user with all details given per place"
      response_body.should include_json({
          places: [
                    {
                        id: @place1.id,

                    }
                  ]
                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  get "/places/:id" do #################
  ######################################


    example_request "Get place details" do
      explanation "Place details"
      response_body.should include_json({
                                            # { "place":
                                            #     {
                                            #      "id": "1",
                                            #      "title": "Lake Bike Trail",
                                            #      "events": "Biking, Hiking, Camping, Fishing",
                                            #      "distance": "4.5",
                                            #      "rating": "2",
                                            #      users who want to be invited here: user1, user2, etc
                                            #     }
                                            #  }
                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  post "/places/:id/like" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "Place id", required: true

    example_request "Like or unlike a place" do
      explanation "Toggles between like/unlike"
      status.should == 200
    end
  end



  ######################################
  get "/places/:id" do #################
  ######################################


    example_request "Get place details" do
      explanation "Place details"
      response_body.should include_json({
                                            # { "place":
                                            #     {
                                            #      "id": "1",
                                            #      "title": "Lake Bike Trail",
                                            #      "events": "Biking, Hiking, Camping, Fishing",
                                            #      "distance": "4.5",
                                            #      "rating": "2",
                                            #      users who want to be invited here: user1, user2, etc
                                            #     }
                                            #  }
                                        }.to_json)
      status.should == 201
    end
  end


end