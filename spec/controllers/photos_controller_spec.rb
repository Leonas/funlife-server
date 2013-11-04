#require 'spec_helper'
#
#describe PhotosController do
#  before do
#    login_user
#  end
#
#  describe "GET to #index" do
#    before do
#      get :index
#    end
#
#    xit{ should assign_to(:photos) }
#    it { should respond_with(:success) }
#  end
#
#  describe "GET to #following" do
#    before do
#      get :following
#    end
#
#    xit{ should assign_to(:photos) }
#    it { should respond_with(:success) }
#  end
#
#  describe "GET to #explore" do
#    before do
#      get :explore
#    end
#
#    xit{ should assign_to(:photos) }
#    it { should respond_with(:success) }
#  end
#
#  describe "with a existing photo" do
#    before do
#      @photo = Factory.create(:photo, :user_id => @current_user.id)
#    end
#
#
#    def photo_attrs
#      h = Factory.attributes_for(:photo)
#      h.delete(:user)
#      h
#    end
#
#    describe "GET to #show" do
#      before do
#        @photo.user_likes << @current_user
#        get :show, id: @photo.id
#      end
#
#      xit{ should assign_to(:photo) }
#      it { should respond_with(:success) }
#      it "should include the like value" do
#        JSON.parse(response.body)["photo"]["liked"].should == true
#      end
#
#    end
#
#    describe "POST to #create" do
#      it "should create a new photo" do
#        expect{
#          post :create, photo: photo_attrs
#        }.to change(Photo, :count).by(1)
#      end
#
#      it "should create a new profile photo" do
#        expect{
#          post :create, photo: photo_attrs.merge({ type: "ProfilePhoto" })
#        }.to change(Photo, :count).by(1)
#      end
#
#      it "should create a new photo" do
#        post :create, photo: photo_attrs
#        should respond_with(:created)
#      end
#    end
#
#    describe "DELETE to #destroy" do
#      it "should destroy a new photo" do
#        expect{
#          delete :destroy, id: @photo.id
#        }.to change(Photo, :count).by(-1)
#      end
#    end
#
#    describe "POST to #like" do
#      let(:photo){ Factory.create(:photo) }
#
#      it "should create a new like" do
#        expect{
#          post :like, id: photo.id
#        }.to change(Like, :count).by(1)
#      end
#
#      it "should destroy a like" do
#        photo = Factory.create(:photo)
#        photo.user_likes << @current_user
#        expect{
#          post :like, id: photo.id
#        }.to change(Like, :count).by(-1)
#      end
#    end
#
#  end
#end
