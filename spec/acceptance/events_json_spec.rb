require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Events" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:setup_events) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)

    @event1 = Factory.create(:event)
    @event2 = Factory.create(:event)
    @event3 = Factory.create(:event)
  end
  let!(:token) { generate_token(@user1) }


  ######################################
  get "/events" do ####################
  ######################################

    header "Authorization", :token
    parameter :sort_by, "Sort by", type: :list, items: [:recommended, :date, :distance]
    parameter :page, "Page", type: :integer

    let(:raw_post) { params.to_json }

    example_request "Get a list of events" do
      explanation "Optionally sort by date or distance"
      response_body.should include_json({

                                            events: [
                                                {
                                                    id: @event1.id,
                                                    title: @event1.title,
                                                    details: @event1.details,
                                                    timestamp_start: @event1.unix_start_time,
                                                    timestamp_end:   @event1.unix_end_time,
                                                    human_start_day: @event1.human_start_day,
                                                    human_start_time: @event1.human_start_hour,
                                                    human_end_day: "November 15",
                                                    human_end_time: "7:00pm",
                                                    human_duration: "1 hour 30 min",
                                                    cover_photo: @event1.cover_photo,
                                                    place: {
                                                        #address details
                                                    },
                                                    photos: [
                                                        { id: 1, url: "url" },
                                                        { id: 1, url: "url" }
                                                    ],
                                                    activities: [
                                                        { id: 1, icon_url: "url" },
                                                        { id: 2, icon_url: "url" }
                                                    ],
                                                    event_guests: [
                                                        { id: 1, name: "name", avatar: "url" },
                                                        { id: 2, name: "name", avatar: "url" }
                                                    ]


                                                }
                                            ]

                                        }.to_json)

      status.should == 200
    end
  end


  ######################################
  get "/events/categories" do ##########
  ######################################

    header "Authorization", :token

    example_request "List every event category" do
      explanation "Lists only categories that have at least 1 event of the type"
      response_body.should include_json({

                                            categories: [
                                                {
                                                    id: 5,
                                                    name: "Running",
                                                    local_icon: "/icons/whatever",
                                                    icon_url:   "cloudinary.com/icon"
                                                },
                                                {
                                                    id: 9,
                                                    name: "Bowling",
                                                    local_icon: "/icons/whatever",
                                                    icon_url: "cloudinary.com/icon"
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

                                               event: {
                                                  id: 1,
                                                  title: "Bowling @ Jupiter Lanes",
                                                  icon_url: "url",
                                                  main_photo_url: "url",
                                                  date: date_object?,
                                                  time: x,
                                                  duration: x,
                                                  end_time: x,
                                                  friendly_time: "Wednesday, Nov 5 @ 6:30pm",
                                                  details: "Lets go bowling for 2 hours during happy hour.",
                                                  more_photos: [ "img_url", "img_url", "img_url" ],
                                                  attending: {
                                                      user_total: 13,
                                                      users: [
                                                          {
                                                              id: 1,
                                                              avatar: "img/url",
                                                              name: "bob j"
                                                          }
                                                      ]
                                                  },
                                                  comments: [
                                                     {
                                                        id: 1,
                                                        parent: null,
                                                        thread_depth: 0,
                                                        user_id: 2,
                                                        user_name: @user1.name,
                                                        avatar: @user1.avatar,
                                                        message: "I'm excited to attend!"

                                                    }
                                                  ]
                                            }
                                        }.to_json)

      status.should == 200
    end
  end




  ######################################
  get "/events/:id/attending" do #######
  ######################################

    header "Authorization", :token
    parameter :id, "Activity id", required: true

    example_request "Get a list of users attending" do
      explanation "An array with user data is returned"
      response_body.should include_json({
                                               attending:
                                               [
                                                  {
                                                     id: 1,
                                                     name: "name",
                                                     avatar: "img_url",
                                                     intro: "some info about me"
                                                  }
                                               ]

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

                                            conversation: {
                                                id: Conversation.last,
                                                users: [@user2.name],
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


    #stuff should be set here
    let(:raw_post) { params.to_json }

    example_request "Update an event" do
      explanation "Updates an event if the user owns it"

      status.should == 204
    end
  end

  ######################################
  post "/events/:id/invite" do #############
  ######################################

    header "Authorization", :token
    parameter :id,        "Event id",   required: true
    parameter :users, "Users to invite", required: true, type: :array

    let(:user_ids) { [@user2.id] }
    let(:message) { "hello" }
    let(:raw_post) { params.to_json }

    example_request "Invite users to an event" do
      explanation ""
      response_body.should include_json({

                                            conversation: {
                                                id: Conversation.last,
                                                users: [@user2.name],
                                                newest_message: "hello",
                                                date: Conversation.last.updated_at.strftime("%b %d,  %I:%M%P")
                                            },

                                        }.to_json)
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

end

