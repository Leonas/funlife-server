require 'spec_helper'

describe PhotosController do

  let(:user1) { Factory.create(:user) }

  before do
    login_user user1
    @photo1 = Factory.create(:photo, user: user1)
    @photo2 = Factory.create(:photo, user: user1)
  end

  def photo_attrs
    attrs = Factory.attributes_for(:photo)
    attrs.delete(:user)
    attrs
  end

  describe "POST to #create" do
    it "should create a new photo" do
      expect {
        post :create, photo: photo_attrs
      }.to change(Photo, :count).by(1)
    end
  end


  context "with a existing photo" do


    describe "DELETE to #destroy" do
      it "should destroy the photo" do
        expect{
          delete :destroy, id: @photo1.id
        }.to change(Photo, :count).by(-1)
      end
    end

    describe "POST to #like" do

      it "should create a new like" do
        expect{ post :toggle_like, id: @photo2.id} .to change{ @photo2.likes.size }.by(1)
      end

      it "should destroy a like" do
        @photo2.liked_by user1
        expect { post :toggle_like, id: @photo2.id }.to change { @photo2.likes.size }.by(-1)
      end
    end

    describe "DELETE to #destroy" do

      it "should not do anything if the user doesn't own the photo" do
        login_user
        expect {
          delete :destroy, id: @photo1.id
        }.to raise_error ActiveRecord::RecordNotFound
      end
    end

  end
end
