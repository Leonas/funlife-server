require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Photos" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:user1) { @user1 = Factory.create(:user) }
  let!(:setup_photos) do
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
  end
  let!(:token) { generate_token(@user1) }

#
### Create a Photo

#step 1
#POST /photos
# -> a new photo item is created on my server
# -> a cloudinary url is instantly stored as it will be using my unique id anyway
# -> confirmed_upload: false




  ######################################
  get "/photos/auth" do ###################
  ######################################

  # https://github.com/cloudinary/cloudinary_gem/blob/master/lib/cloudinary/utils.rb shows how to do the hashing

    header "Authorization", :token

    example_request "Get authorization for doing direct photo upload" do
      explanation "Cloudinary signature and api token is given in response"
      response_body.should include_json({

                                            upload_auth: {
                                                unix_timestamp: xxx,
                                                api_key: xxx,
                                                upload_url: xxx,
                                                unique_photo_id: xxx,
                                                cloudinary_signature: xxx
                                            }

                                        }.to_json)

      expect(status).to eq(201)
    end
  end


  ######################################
  post "/photos/" do #################
  ######################################

  #pre:
  #do a httparty post to cloudinary with sample image
  #recieved are some kinds of data markers


  #put to /photos/:id with this extra received data, sets confirmed_upload: true

    parameter :id, "Photo id", required: true
    parameter :stuff_from_cloudinary, required: true

    example_request "Update photo details with stuff from cloudinary" do
      explanation "meow"
      expect(status).to eq(200)
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
                                                date: xxx
                                            }

                                        }.to_json)

      expect(status).to eq(200)
    end
  end


  ######################################
  delete "/photos/:id" do ###########
  ######################################

    header "Authorization", :token
    parameter :id, "Photo id", required: true


    example_request "Delete a photo" do
      explanation "Deletes a photo that the user owns"

    #  expect(@user1.reload.following_count).to eq(0)
      status.should == 204
    end
  end
end