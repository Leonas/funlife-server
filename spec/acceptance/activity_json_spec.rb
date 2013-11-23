require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Activities" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:user1) { @user1 = Factory.create(:user) }
  let!(:setup_activities) do
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
  end
  let!(:token) { generate_token(@user1) }

  ######################################
  get "/activities" do ###################
  ######################################


    header "Authorization", :token

    example_request "Get list of all activity types" do
      explanation ""
      response_body.should include_json({

                                            upload_auth: {
                                                unix_timestamp: xxx,
                                                api_key: xxx,
                                                upload_url: xxx,
                                                unique_photo_id: xxx,
                                                cloudinary_signature: xxx
                                            }

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/activities/:id" do #############
  ######################################


    header "Authorization", :token
    parameter :id, required: true

    example_request "Get all places and events for this activity type" do
      explanation ""
      response_body.should include_json({

                                            upload_auth: {
                                                unix_timestamp: xxx,
                                                api_key: xxx,
                                                upload_url: xxx,
                                                unique_photo_id: xxx,
                                                cloudinary_signature: xxx
                                            }

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/activities/:id/places" do #############
  ######################################


    header "Authorization", :token
    parameter :id, required: true

    example_request "Get all places for this activity type" do
      explanation ""
      response_body.should include_json({

                                            upload_auth: {
                                                unix_timestamp: xxx,
                                                api_key: xxx,
                                                upload_url: xxx,
                                                unique_photo_id: xxx,
                                                cloudinary_signature: xxx
                                            }

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  get "/activities/:id/events" do ######
  ######################################


    header "Authorization", :token
    parameter :id, required: true

    example_request "Get all events for this activity type" do
      explanation ""
      response_body.should include_json({

                                            upload_auth: {
                                                unix_timestamp: xxx,
                                                api_key: xxx,
                                                upload_url: xxx,
                                                unique_photo_id: xxx,
                                                cloudinary_signature: xxx
                                            }

                                        }.to_json)

      status.should == 200
    end
  end

end
