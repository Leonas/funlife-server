require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Photos" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:user1) { @user1 = Factory.create(:user) }
  let!(:setup_photos) do
    @photo1 = Factory.create(:photo, uploaded_by: @user1)
    Timecop.return
    @auth = Photo.cloudinary_auth
    @sample_photo = File.new(File.expand_path("../sample_photo.png", __FILE__))

    options = {
      query: {
       file: @sample_photo,
       api_key: @auth[:api_key],
       timestamp: @auth[:timestamp],
       signature: @auth[:signature]
      }
    }
    @cloudinary_response = HTTMultiParty.post(@auth[:upload_url], options)
  end
  let!(:token) { @token = generate_token(@user1) }


  ######################################
  get "/photos/auth" do ################
  ######################################

    header "Authorization", :token

    example_request "Get authorization for doing direct photo upload to cloudinary" do
      explanation "Cloudinary signature and api token is given in response"

      response_body.should have_json_keys(
          :timestamp,
          :api_key,
          :upload_url,
          :signature
                           ).at_path("upload_auth")

      current_response = JSON.parse(response_body)["upload_auth"]
      current_response["timestamp"].should_not be_nil
      current_response["api_key"].should_not be_nil
      current_response["upload_url"].should_not be_nil
      current_response["signature"].should_not be_nil
      status.should == 201
    end
  end



  ######################################
  post "/photos/" do #################
  ######################################

    header "Authorization", :token
    parameter :bytes,      required: true
    parameter :format,     required: true
    parameter :height,     required: true
    parameter :width,      required: true
    parameter :public_id,  required: true
    parameter :url,        required: true
    parameter :secure_url, required: true
    parameter :signature,  required: true
    parameter :version,    required: true

    let(:byes)       { @cloudinary_response["bytes"] }
    let(:format)     { @cloudinary_response["format"] }
    let(:height)     { @cloudinary_response["height"] }
    let(:width)      { @cloudinary_response["width"] }
    let(:public_id)  { @cloudinary_response["public_id"] }
    let(:url)        { @cloudinary_response["url"] }
    let(:secure_url) { @cloudinary_response["secure_url"] }
    let(:signature)  { @cloudinary_response["signature"] }
    let(:version)    { @cloudinary_response["version"] }
    let(:raw_post)   { params.to_json }

    example_request "Create a photo" do
      explanation "Creates a photo link using data provided by cloudinary"
      status.should == 201
    end
  end



  ######################################
  post "/photos/:id/like" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "Photo id", required: true

    example_request "Like or unlike a photo" do
      explanation "Toggles between like/unlike"
      status.should == 200
    end
  end



  ######################################
  get "/photos/:id" do #################
  ######################################

    parameter :id, "Photo id", required: true

    example_request "View a single photo" do
      explanation "Details for a photo are received"
      response_body.should include_json({

                                            photo: {
                                                id: xxx,
                                                url: xxx,
                                                date: xxx,
                                                like_count: 50,
                                                liked: true
                                            }

                                        }.to_json)

      status.should == 200
    end
  end



  ######################################
  delete "/photos/:id" do ##############
  ######################################

    header "Authorization", :token
    parameter :id, "Photo id", required: true


    example_request "Delete a photo" do
      explanation "Deletes a photo that the user owns"

      status.should == 204
    end
  end
end