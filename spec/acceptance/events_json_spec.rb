require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Events" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:setup_events) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)

    @event1 = Factory.create(:future_event, admins: [@user1], invited: [@user2])
    @event2 = Factory.create(:event)
    @event3 = Factory.create(:event)
  end
  let!(:token) { generate_token(@user1) }


  ######################################
  get "/events" do ####################
  ######################################

    header "Authorization", :token
    parameter :page, "Page", type: :integer

    let(:raw_post) { params.to_json }

    example_request "Get a list of events" do
      explanation "Returns a list of events"
      response_body.should include_json({

                                            events: [
                                                {
                                                    id: @event1.id,
                                                    title: @event1.title,
                                                    details: @event1.details,
                                                    start_time: @event1.start_time.strftime("%b %d,  %I:%M%P"),
                                                    end_time: @event1.end_time.strftime("%b %d,  %I:%M%P"),
                                                    duration: "1 hour 30 min",
                                                    cover_photo: @event1.cover_photo,
                                                    location: {
                                                        street_address: @event1.street_address,
                                                        zip_code:  @event1.zip_code,
                                                        city:      @event1.city,
                                                        state:     @event1.state,
                                                        longitude: @event1.longitude,
                                                        latitude:  @event1.latitude
                                                    },
                                                    activities: JSONOutput.activities([@activity1, @activity2]),
                                                    photos: JSONOutput.photos([@photo1, @photo2], @user1),
                                                    admins: JSONOutput.users([@user1]),
                                                    invited: JSONOutput.users([@user1]),
                                                    attending: JSONOutput.users([@user1]),
                                                    comments: JSONOutput.comments([@comment1]),
                                                },
                                                {
                                                    id:         @event1.id,
                                                    title:      @event1.title,
                                                    details:    @event1.details,
                                                    start_time: @event1.start_time.strftime("%b %d,  %I:%M%P"),
                                                    end_time:   @event1.end_time.strftime("%b %d,  %I:%M%P"),
                                                    duration:   "1 hour 30 min",
                                                    cover_photo: @event1.cover_photo,
                                                    location:   {
                                                        street_address: @event1.street_address,
                                                        zip_code:  @event1.zip_code,
                                                        city:      @event1.city,
                                                        state:     @event1.state,
                                                        longitude: @event1.longitude,
                                                        latitude:  @event1.latitude
                                                    },
                                                    activities: JSONOutput.activities([@activity1, @activity2]),
                                                    photos:     JSONOutput.photos([@photo1, @photo2], @user1),
                                                    admins:     JSONOutput.users([@user1]),
                                                    invited:    JSONOutput.users([@user1]),
                                                    attending:  JSONOutput.users([@user1]),
                                                    comments:   JSONOutput.comments([@comment1]),
                                                }
                                            ]

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/events/:id" do #################
  ######################################

    header "Authorization", :token
    parameter :id, "Event id", required: true

    example_request "View details for an event" do
      explanation "Various details for the event"
      response_body.should include_json({

                                              #event: JSONOutput.event()


                                               event: {
                                                   id:         @event1.id,
                                                   title:      @event1.title,
                                                   details:    @event1.details,
                                                   start_time: @event1.start_time.strftime("%b %d,  %I:%M%P"),
                                                   end_time:   @event1.end_time.strftime("%b %d,  %I:%M%P"),
                                                   duration:   "1 hour 30 min",
                                                   cover_photo: @event1.cover_photo,
                                                   location:   {
                                                       street_address: @event1.street_address,
                                                       zip_code:  @event1.zip_code,
                                                       city:      @event1.city,
                                                       state:     @event1.state,
                                                       longitude: @event1.longitude,
                                                       latitude:  @event1.latitude
                                                   },
                                                   activities: JSONOutput.activities([@activity1, @activity2]),
                                                   photos:     JSONOutput.photos([@photo1, @photo2], @user1),
                                                   admins:     JSONOutput.users([@user1]),
                                                   invited:    JSONOutput.users([@user1]),
                                                   attending:  JSONOutput.users([@user1]),
                                                   comments:   JSONOutput.comments([@comment1]),
                                               }
                                        }.to_json)

      status.should == 200
    end
  end




  ######################################
  post "/events" do #############
  ######################################

    header "Authorization", :token
    parameter :title,                 "Event title",                           scope: :event
    parameter :details,               "Details",                               scope: :event
    parameter :category,              "Category",                              scope: :event
    parameter :place_id,              "Place id (optional if address given)",  scope: :event
    parameter :address,               "Address (optional if place id given)",  scope: :event
    parameter :date,                  "Date of event",                         scope: :event
    parameter :start_time,            "Start time",                            scope: :event
    parameter :end_time,              "End time (optional if duration given)", scope: :event
    parameter :duration,              "Duration (optional if end time given)", scope: :event
    parameter :private,               "Visible only to those invited?",        scope: :event, type: :boolean
    parameter :visible_to_women,      "Visible to women?",                     scope: :event, type: :boolean
    parameter :visible_to_men,        "Visible to men?",                       scope: :event, type: :boolean
    parameter :youngest_allowed_age,  "Youngest allowed age",                  scope: :event
    parameter :oldest_allowed_age,    "Oldest allowed age",                    scope: :event

    let(:user_ids) { [@user2.id] }
    let(:message) { "hello" }
    let(:raw_post) { params.to_json }

    example_request "Create a new event" do
      explanation "Event will only become active once all the data is filled out but it is not necessary to do it in one request"
      response_body.should include_json({

                                            event: {
                                                id: Conversation.last,
                                                users: JSONOutput.users([@user1, @user2]),
                                                newest_message: "hello",
                                                date: Conversation.last.updated_at.strftime("%b %d,  %I:%M%P")
                                            },

                                        }.to_json)
      status.should == 201
    end
  end



  ######################################
  put "/events/:id" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "Event id", required: true
    parameter :title,                 "Event title",                           scope: :event
    parameter :details,               "Details",                               scope: :event
    parameter :category,              "Category",                              scope: :event
    parameter :place_id,              "Place id (optional if address given)",  scope: :event
    parameter :address,               "Address (optional if place id given)",  scope: :event
    parameter :date,                  "Date of event",                         scope: :event
    parameter :start_time,            "Start time",                            scope: :event
    parameter :end_time,              "End time (optional if duration given)", scope: :event
    parameter :duration,              "Duration (optional if end time given)", scope: :event
    parameter :private,               "Visible only to those invited?",        scope: :event, type: :boolean
    parameter :visible_to_women,      "Visible to women?",                     scope: :event, type: :boolean
    parameter :visible_to_men,        "Visible to men?",                       scope: :event, type: :boolean
    parameter :youngest_allowed_age,  "Youngest allowed age",                  scope: :event
    parameter :oldest_allowed_age,    "Oldest allowed age",                    scope: :event


    let(:details) { "Running from the cops" }
    let(:raw_post) { params.to_json }

    example_request "Update an event" do
      explanation "Updates an event if the user is an admin to it"

      status.should == 204
    end
  end



  ######################################
  post "/events/:id/invite" do #############
  ######################################

    header "Authorization", :token
    parameter :id,        "Event id",   required: true
    parameter :users, "Users to invite", required: true, type: :array
    parameter :message, "Invitation message"

    let(:user_ids) { [@user2.id, @user3.id] }
    let(:message) { "Come to my event" }
    let(:raw_post) { params.to_json }

    example_request "Invite users to an event" do
      explanation "An invitation is sent along with a message"
      status.should == 201
    end
  end



  ######################################
  delete "/events/:id" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "Event id", required: true


    example_request "Delete an event" do
      explanation "Deletes an event that the user owns"

      status.should == 204
    end
  end


  ######################################
  get "/events/:id/comments" do ########
    ######################################

    it_should_behave_like "GET /resource/:id/comments" do
      let!(:setup_resource) do
        @resource = @event1
        @comments = [@comment1, @comment2]
      end
    end

  end


  ######################################
  post "/events/:id/comments" do #######
    ######################################

    it_should_behave_like "POST /resource/:id/comments" do
      let!(:setup_resource) do
        @resource = @event1
      end
    end

  end

end

