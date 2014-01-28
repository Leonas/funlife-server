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

    @place1.liked_by @user1
    @place2.liked_by @user2

    @comment1 = Factory.create(:comment_on_place, user: @user1, commentable: @place1)
    @comment2 = Factory.create(:comment_on_place, user: @user2, commentable: @place1)
    @comment3 = Factory.create(:comment_on_place, user: @user2, commentable: @place2)

    @activity1 = Factory.create(:activity, places: [@place1])
    @activity2 = Factory.create(:activity, places: [@place1])
    @activity3 = Factory.create(:activity, places: [@place2])

    @photo1 = Factory.create(:photo_of_place, imageable: @place1)
    @photo2 = Factory.create(:photo_of_place, imageable: @place1)
    @photo3 = Factory.create(:photo_of_place, imageable: @place2)
  end

  let!(:token) { @token = generate_token(@user1) }



  ######################################
  get "/places" do #####################
  ######################################

    header "Authorization", :token

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
                        favorited_by: SharedJSON.favorited_by([@user1]),
                        activities: SharedJSON.activities([@activity1, @activity2]),
                        photos: SharedJSON.photos([@photo1, @photo2], @user1),
                        comments: SharedJSON.comments([@comment1, @comment2])
                    },
                    {
                        id:           @place2.id,
                        name:         @place2.name,
                        street_address: @place2.street_address,
                        zip_code:     @place2.zip_code,
                        city:         @place2.city,
                        longitude:    @place2.longitude,
                        latitude:     @place2.latitude,
                        time_open:    @place2.time_open,
                        time_close:   @place2.time_close,
                        phone:        @place2.phone,
                        description:  @place2.description,
                        favorited_by: SharedJSON.favorited_by([@user2]),
                        activities:   SharedJSON.activities([@activity3]),
                        photos:       SharedJSON.photos([@photo3], @user1),
                        comments:     SharedJSON.comments([@comment3])
                    },
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
                                            favorited_by: SharedJSON.favorited_by([@user1]),
                                            activities: SharedJSON.activities([@activity1, @activity2]),
                                            photos:     SharedJSON.photos([@photo1, @photo2], @user1),
                                            comments:   SharedJSON.comments([@comment1, @comment2])

                                          }
                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  post "/places/:id/toggle_like" do ####
  ######################################

    it_should_behave_like "POST /resource/:id/toggle_like" do
      let!(:setup_resource) do
        @resource = @place1
      end
    end

  end



  ######################################
  get "/places/:id/comments" do ########
  ######################################

    it_should_behave_like "GET /resource/:id/comments" do
      let!(:setup_resource) do
        @resource = @place1
        @comments = [@comment1, @comment2]
      end
    end

  end


  ######################################
  post "/places/:id/comments" do #######
  ######################################

    it_should_behave_like "POST /resource/:id/comments" do
      let!(:setup_resource) do
        @resource = @place1
      end
    end

  end


end