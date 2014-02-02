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
  get "/activities" do #################
  ######################################


    header "Authorization", :token

    example_request "Get list of all activity types" do
      explanation ""
      response_body.should include_json({ activities: [@activity1, @activity2] }.to_json)
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

                                            place_ids: [@place1.id, @place2.id],
                                            event_ids: [@event1.id, @event2.id],
                                            #places: JSONOutput.places([@place1, @place2], extra: {
                                            #    liked_by: [@user1],
                                            #    activities: [@activity1],
                                            #    photos: [@photo1],
                                            #    comments: [@comment1]
                                            #})
                                            #place2s: [
                                            #            {
                                            #                id:           @place1.id,
                                            #                name:         @place1.name,
                                            #                street_address: @place1.street_address,
                                            #                zip_code:     @place1.zip_code,
                                            #                city:         @place1.city,
                                            #                longitude:    @place1.longitude,
                                            #                latitude:     @place1.latitude,
                                            #                time_open:    @place1.time_open,
                                            #                time_close:   @place1.time_close,
                                            #                phone:        @place1.phone,
                                            #                description:  @place1.description,
                                            #                liked_by: JSONOutput.liked_by([@user1]),
                                            #                activities:   JSONOutput.activities([@activity1, @activity2]),
                                            #                photos:       JSONOutput.photos([@photo1, @photo2], @user1),
                                            #                comments:     JSONOutput.comments([@comment1, @comment2])
                                            #
                                            #            },
                                            #            {
                                            #                id:           @place1.id,
                                            #                name:         @place1.name,
                                            #                street_address: @place1.street_address,
                                            #                zip_code:     @place1.zip_code,
                                            #                city:         @place1.city,
                                            #                longitude:    @place1.longitude,
                                            #                latitude:     @place1.latitude,
                                            #                time_open:    @place1.time_open,
                                            #                time_close:   @place1.time_close,
                                            #                phone:        @place1.phone,
                                            #                description:  @place1.description,
                                            #                liked_by: JSONOutput.liked_by([@user1]),
                                            #                activities:   JSONOutput.activities([@activity1, @activity2]),
                                            #                photos:       JSONOutput.photos([@photo1, @photo2], @user1),
                                            #                comments:     JSONOutput.comments([@comment1, @comment2])
                                            #
                                            #            }
                                            #        ],
                                            #events: [
                                            #            {
                                            #                id:         @event1.id,
                                            #                title:      @event1.title,
                                            #                details:    @event1.details,
                                            #                start_time: @event1.start_time.strftime("%b %d,  %I:%M%P"),
                                            #                end_time:   @event1.end_time.strftime("%b %d,  %I:%M%P"),
                                            #                duration:   "1 hour 30 min",
                                            #                cover_photo: @event1.cover_photo,
                                            #                location:   {
                                            #                    street_address: @event1.street_address,
                                            #                    zip_code:  @event1.zip_code,
                                            #                    city:      @event1.city,
                                            #                    state:     @event1.state,
                                            #                    longitude: @event1.longitude,
                                            #                    latitude:  @event1.latitude
                                            #                },
                                            #                activities: JSONOutput.activities([@activity1, @activity2]),
                                            #                photos:     JSONOutput.photos([@photo1, @photo2], @user1),
                                            #                admins:     JSONOutput.users([@user1]),
                                            #                invited:    JSONOutput.users([@user1]),
                                            #                attending:  JSONOutput.users([@user1]),
                                            #                comments:   JSONOutput.comments([@comment1]),
                                            #            },
                                            #            {
                                            #                id:         @event1.id,
                                            #                title:      @event1.title,
                                            #                details:    @event1.details,
                                            #                start_time: @event1.start_time.strftime("%b %d,  %I:%M%P"),
                                            #                end_time:   @event1.end_time.strftime("%b %d,  %I:%M%P"),
                                            #                duration:   "1 hour 30 min",
                                            #                cover_photo: @event1.cover_photo,
                                            #                location:   {
                                            #                    street_address: @event1.street_address,
                                            #                    zip_code:  @event1.zip_code,
                                            #                    city:      @event1.city,
                                            #                    state:     @event1.state,
                                            #                    longitude: @event1.longitude,
                                            #                    latitude:  @event1.latitude
                                            #                },
                                            #                activities: JSONOutput.activities([@activity1, @activity2]),
                                            #                photos:     JSONOutput.photos([@photo1, @photo2], @user1),
                                            #                admins:     JSONOutput.users([@user1]),
                                            #                invited:    JSONOutput.users([@user1]),
                                            #                attending:  JSONOutput.users([@user1]),
                                            #                comments:   JSONOutput.comments([@comment1]),
                                            #            }
                                            #        ]

                                        }.to_json)

      status.should == 200
    end
  end


end
