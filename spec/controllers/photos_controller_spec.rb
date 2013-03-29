require 'spec_helper'

describe PhotosController do
  before do
    login_user
  end

  describe "GET to #index" do
    before do
      get :index
    end

    it { should assign_to(:photos) }
    it { should respond_with(:success) }
  end

  describe "GET to #friends" do
    before do
      get :friends
    end

    it { should assign_to(:photos) }
    it { should respond_with(:success) }
  end

  describe "GET to #explore" do
    before do
      get :explore
    end

    it { should assign_to(:photos) }
    it { should respond_with(:success) }
  end

  describe "with a existing photo" do
    before do
      @photo = create(:photo, :user_id => @current_user.id)
    end


    def photo_attrs
      h = attributes_for(:photo)
      h.delete(:user)
      h
    end

    describe "GET to #show" do
      before do
        get :show, id: @photo.id
      end

      it { should assign_to(:photo) }
      it { should respond_with(:success) }

    end

    describe "POST to #create" do
      it "should create a new photo" do
        expect{
          post :create, photo: photo_attrs
        }.to change(Photo, :count).by(1)
      end

      it "should create a new profile photo" do
        expect{
          post :create, photo: photo_attrs.merge({ type: "ProfilePhoto" })
        }.to change(Photo, :count).by(1)
      end

      it "should create a new photo" do
        post :create, photo: photo_attrs
        should respond_with(:created)
      end
    end

    describe "DELETE to #destroy" do
      it "should destroy a new photo" do
        expect{
          delete :destroy, id: @photo.id
        }.to change(Photo, :count).by(-1)
      end
    end

  end
end
