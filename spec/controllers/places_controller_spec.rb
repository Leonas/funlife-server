require 'spec_helper'

describe PlacesController do


  let(:valid_attributes) { attributes_for(Factory.create(:place)) }

  let(:valid_session) do
    @user1 = Factory.create(:user)
    login_user(@user1)
  end

  describe "GET index" do
    it "assigns all places as @places" do
      place = Place.create! valid_attributes
      get :index, {}, valid_session
      assigns(:places).should eq([place])
    end
  end

  describe "GET show" do
    it "assigns the requested place as @place" do
      place = Place.create! valid_attributes
      get :show, {id: place.to_param}, valid_session
      assigns(:place).should eq(place)
    end
  end


  describe "POST like" do
    describe "with valid token" do
      it "creates a new like" do
        expect {
          post :create, {place: valid_attributes}, valid_session
        }.to change(Place.likes, :count).by(1)
      end

      it "assigns the like to the current user" do
        post :create, {place: valid_attributes}, valid_session
        assigns(:place).should be_a(Place)
      end

    end

    describe "with invalid token" do
      it "gives some kind of error" do
        # Trigger the behavior that occurs when invalid params are submitted
        Place.any_instance.stub(:save).and_return(false)
        post :create, {place: {"name" => "invalid value"}}, valid_session
        assigns(:place).should be_a_new(Place)
      end


    end
  end


end
