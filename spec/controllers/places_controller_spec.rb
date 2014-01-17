require 'spec_helper'

describe PlacesController do


  let(:valid_attributes) { Factory.attributes_for(:place) }

  before do
    @place1 = Factory.create(:place)
    @user1 = Factory.create(:user)
    login_user(@user1)
  end


  describe "GET show" do
    it "assigns the requested place as @place" do
      place = Place.create! valid_attributes
      get :show, {id: place.to_param}
      assigns(:place).should eq(place)
    end
  end


  describe "POST like" do
    describe "with valid token" do
      it "creates a new like" do
        expect { post :toggle_like, id: @place1.id }.to change{ @place1.likes.size }.by(1)
      end

      it "assigns the like to the current user" do
        post :toggle_like, id: @place1.id
        expect { @user.liked? @place1 }.to be_true
      end

    end

  end


end
