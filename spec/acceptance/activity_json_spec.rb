require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Activities" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:user1) { @user1 = Factory.create(:user) }
  let!(:setup_activities) do
    @activity1 = Factory.create(:activity)
    @activity2 = Factory.create(:activity)
  end
  let!(:token) { generate_token(@user1) }

  ######################################
  get "/activities" do ###################
  ######################################


    header "Authorization", :token

    example_request "Get list of all activity types" do
      explanation ""
      response_body.should include_json({

                                            activities: [
                                                {
                                                    id: @activity1.id,
                                                    name: @activity1.name,
                                                    icon_url: @activity1.icon_url
                                                },
                                                {
                                                    id: @activity2.id,
                                                    name: @activity2.name,
                                                    icon_url: @activity2.icon_url
                                                }
                                            ]

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/activities/:id" do #############
  ######################################


    header "Authorization", :token
    parameter :id, "Activity id", required: true

    let(:id) { @activity1.id }

    example_request "Get all places and events for this activity type" do
      explanation ""
      response_body.should include_json({

                                            place_ids: [],
                                            activity_ids: [],
                                            places: [
                                                {

                                                }
                                                    ],
                                            activities: [
                                                {

                                                }
                                                    ]

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/activities/:id/places" do #############
  ######################################


    header "Authorization", :token
    parameter :id, "Activity id", required: true

    let(:id) { @activity1.id }

    example_request "Get all places for this activity type" do
      explanation ""
      response_body.should include_json({

                                            place_ids: [1],
                                            places: [
                                                        {
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
                                                                         ],
                                                            liked_by:    [
                                                                             {
                                                                                 user_id: 3
                                                                             }
                                                                         ]

                                                        }
                                                       ]

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/activities/:id/events" do ######
  ######################################


    header "Authorization", :token
    parameter :id, "Activity id", required: true

    example_request "Get all events for this activity type" do
      explanation ""
      response_body.should include_json({

                                            events: [
                                                        {
                                                id:            1,
                                                title:         "Bowling @ Jupiter Lanes",
                                                icon_url:      "url",
                                                main_photo_url: "url",
                                                date:          date_object?,
                                                time:          x,
                                                duration:      x,
                                                end_time:      x,
                                                friendly_time: "Wednesday, Nov 5 @ 6:30pm",
                                                details:       "Lets go bowling for 2 hours during happy hour.",
                                                more_photos:   ["img_url", "img_url", "img_url"],
                                                attending:     {
                                                    user_total: 13,
                                                    users: [
                                                                    {
                                                                        id:   1,
                                                                        avatar: "img/url",
                                                                        name: "bob j"
                                                                    }
                                                                ]
                                                },
                                                comments:      [
                                                                   {
                                                                       id:           1,
                                                                       parent:       null,
                                                                       thread_depth: 0,
                                                                       user_id:      2,
                                                                       user_name:    @user1.name,
                                                                       avatar:       @user1.avatar,
                                                                       message:      "I'm excited to attend!"

                                                                   }
                                                               ]
                                                }
                                            ]

                                        }.to_json)

      status.should == 200
    end
  end

end
