require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Photos" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:user1) { @user1 = Factory.create(:user) }
  let!(:setup_photos) do
    @photo1 = Factory.create(:photo, user: @user1)
    @auth = Photo.cloudinary_auth
    @sample_photo = File.new(File.expand_path("../sample_photo.png", __FILE__))

    # Live Values
    #options = {
    #  query: {
    #   file: @sample_photo,
    #   api_key: @auth[:api_key],
    #   timestamp: @auth[:timestamp],
    #   signature: @auth[:signature]
    #  }
    #}
    #@cloudinary_response = HTTMultiParty.post(@auth[:upload_url], options)

    #Cached Values
    @cloudinary_response = {
        "bytes"=> 41499,
        "created_at"=> "2014-01-17T06:34:19Z",
        "etag"=> "850cde4394f78e6ecc4aed306a8b487e",
        "format"=> "png",
        "height"=> 256,
        "public_id"=> "y2bprzrqadkhl1tyoosh",
        "resource_type"=> "image",
        "secure_url"=> "https://res.cloudinary.com/funlife/image/upload/v1389940459/y2bprzrqadkhl1tyoosh.png",
        "signature"=> "bc2a731f6e130f3a5bba802d29853d385d7e5ee9",
        "type"=> "upload",
        "url"=> "http://res.cloudinary.com/funlife/image/upload/v1389940459/y2bprzrqadkhl1tyoosh.png",
        "version"=> 1389940459,
        "width"=> 256
    }
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
  post "/photos" do #################
  ######################################

    header "Authorization", :token
    parameter :bytes, "bytes",      scope: :photo, required: true
    parameter :format, "format",    scope: :photo, required: true
    parameter :height, "height",     scope: :photo, required: true
    parameter :width, "width",      scope: :photo, required: true
    parameter :public_id, "public_id",  scope: :photo, required: true
    parameter :url, "URL",        scope: :photo, required: true
    parameter :secure_url, "secure_url", scope: :photo, required: true
    parameter :signature, "signature",  scope: :photo, required: true
    parameter :version, "version",    scope: :photo, required: true

    let(:bytes)      { @cloudinary_response["bytes"] }
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
  post "/photos/:id/toggle_like" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "Photo id", required: true

    let(:id) { @photo1.id }

    example_request "Like or unlike a photo" do
      explanation "Toggles between like/unlike"
      status.should == 201
    end
  end



  ######################################
  get "/photos/:id" do #################
  ######################################

    header "Authorization", :token
    parameter :id, "Photo id", required: true

    let(:id) { @photo1.id }

    example_request "View a single photo" do
      explanation "Details for a photo are received"
      response_body.should include_json({

                                            photo: {
                                                id: @photo1.id,
                                                url: @photo1.url,
                                                date: @photo1.updated_at.strftime("%b %d,  %I:%M%P"),
                                                like_count: 0,
                                                liked: false
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

    let(:id) { @photo1.id }


    example_request "Delete a photo" do
      explanation "Deletes a photo that the user owns"

      status.should == 204
    end
  end
end