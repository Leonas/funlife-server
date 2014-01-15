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

    header "Authorization", :token
    parameter :longitude,  "Longitude", scope: :location   #if not here take from user
    parameter :latitude,   "Latitude",  scope: :location

    let(:longitude) { Faker::Address.longitude }
    let(:latitude)  { Faker::Address.latitude }

    example_request "Get an array of nearby places" do
      explanation "All places sorted by distance to user with all details given per place"
      response_body.should include_json({
          places: [
                    {
                        id: @place1.id,
                        name: @place1.name,
                        street_address: @place1.street_address,
                        zip_code: @place1.zip_code,
                        city: @place1.city,
                        longitude: @place1.longitude,
                        latitude: @place1.latitude,
                        time_open: @place1.time_open,
                        time_close: @place1.time_close,
                        phone: @place1.phone,
                        description: @place1.description,
                        favorited_by: [
                                          {
                                              user_id: 3
                                          }
                        ],
                        activities: [
                            {
                                id: 4,
                                name: "running"
                            }

                        ],
                        photos: [
                            {

                            },
                            {

                            }
                        ],
                        comments: [
                            {

                            },
                            {

                            }
                        ]


                    }
                  ]
                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  get "/places/:id" do #################
  ######################################

    header "Authorization", :token
    parameter :id, "Place id", required: true

    let(:id) { @place1.id }


    example_request "Place details" do
      explanation "Single place details"
      response_body.should include_json({
                                            place: {
                                                            id:          @place1.id,
                                                            name:        @place1.name,
                                                            street_address: @place1.street_address,
                                                            zip_code:    @place1.zip_code,
                                                            city:        @place1.city,
                                                            longitude:   @place1.longitude,
                                                            latitude:    @place1.latitude,
                                                            time_open:   @place1.time_open,
                                                            time_close:  @place1.time_close,
                                                            phone:       @place1.phone,
                                                            description: @place1.description,
                                                            favorited_by: [
                                                                          {
                                                                              user_id: 3
                                                                          }
                                                                      ],

                                                            activities:  [
                                                                             {
                                                                                 id:   4,
                                                                                 name: "running"
                                                                             }

                                                                         ],
                                                            photos:      [
                                                                             {

                                                                             },
                                                                             {

                                                                             }
                                                                         ],
                                                            comments:    [
                                                                             {

                                                                             },
                                                                             {

                                                                             }
                                                                         ]

                                                        }
                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  post "/places/:id/toggle_like" do ####
  ######################################

    header "Authorization", :token
    parameter :id, "Place id", required: true

    let(:id) { @place1.id }

    example_request "Like or unlike a place" do
      explanation "Toggles between like/unlike"
      status.should == 201 || 204
      expect(@place1.likes.count).to eq(1)
    end
  end



  ######################################
  get "/places/:id/comments" do ##########
  ######################################

    header "Authorization", :token
    parameter :id, "Place id", required: true

    let(:id) { @place1.id }

    example_request "Get place comments" do
      explanation "Place comments"
      response_body.should include_json({
                                            comments: [
                                                          {
                                                              id:        1,
                                                              parent:    nil,
                                                              depth: 0,
                                                              user_id:   2,
                                                              user_name: @user1.name,
                                                              user_avatar:    @user1.avatar,
                                                              text:   "I'm excited to attend!"

                                                          }
                                            ]

                                        }.to_json)
      status.should == 201
    end
  end


  ######################################
  post "/places/:id/comments" do #######
  ######################################

    header "Authorization", :token
    parameter :id, "Place id", required: true
    parameter :parent_id, "Reply to comment id", scope: :comment
    parameter :text, "Comment text",            scope: :comment, required: true

    let(:id) { @place1.id }
    let(:text) { "I'm excited to attend!" }
    let(:raw_post) { params.to_json }

    example_request "Post a comment on the place" do
      explanation "Place comments"
      response_body.should include_json({
                                            comment: {
                                                              id:        1,
                                                              parent:    nil,
                                                              thread_depth: 0,
                                                              user_id:   2,
                                                              user_name: @user1.name,
                                                              avatar:    @user1.avatar,
                                                              text:      "I'm excited to attend!"

                                                          }
                                        }.to_json)
      status.should == 201
    end
  end


end