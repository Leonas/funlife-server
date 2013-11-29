require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Places" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:setup_places) do

  end
  let!(:token) { generate_token(@user1) }


  ######################################
  get "/places" do #####################
  ######################################

    parameter :longitude,  "Longitude"
    parameter :latitude,   "Latitude"
    parameter :activities, "Activity"
    parameter :categories, "Category"

    let(:longitude) { @user1.longitude }
    let(:latitude)  { @user1.latitude }

    example_request "Get a list of nearby places" do
      explanation "All places sorted by distance to user"
      response_body.should include_json({
      #                                      "places" : [
      #    {
      #        "id" : "1",
      #    "icon_url" : "/biking.png",
      #    "lon" : "-23.2342",
      #    "lat" : "32.1232"
      #}
      #]
                                        }.to_json)
      status.should == 201
    end
  end

  ######################################
  get "/places/categories" do ##########
  ######################################


    example_request "List all place categories" do
      explanation ""
      response_body.should include_json({
      #                                      "places" : [
      #    {
      #        "id" : "1",
      #    "icon_url" : "/biking.png",
      #    "lon" : "-23.2342",
      #    "lat" : "32.1232"
      #}
      #]
                                        }.to_json)
      status.should == 201
    end
  end

  ######################################
  get "/places/:id" do #################
  ######################################


    example_request "Get place details" do
      explanation "All places sorted by distance to user"
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

  ######################################
  get "/places/:id/summary" do #########
  ######################################

    example_request "Get a short summary of place info to be used on the map page" do
      explanation ""
      response_body.should include_json({

                                        }.to_json)
      status.should == 201
    end
  end

  ######################################
  get "/places/:id/photos" do ##########
  ######################################

    example_request "Get place photos" do
      explanation ""
      response_body.should include_json({

                                        }.to_json)
      status.should == 201
    end
  end
end