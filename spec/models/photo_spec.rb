require 'spec_helper'

describe Photo do

  before do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @photo = Factory.create(:photo, uploaded_by: @user1)
  end

  it "should belong to a user" do
    expect(@user1.photos).to include(@photo)
  end

  it "should allow owner to like own photo" do
    expect {
      @photo.liked_by @user1
      @photo.reload
    }.to change { @photo.likes.size }.by(1)
  end

  it "should be able to be liked by another user" do
    expect{
      @photo.liked_by @user2
      @photo.reload
    }.to change{ @photo.likes.size }.by(1)
  end

  context "when liked" do

    before(:each) do
      @photo.liked_by @user2
    end

    it "should be able to be unliked" do
       expect{
         @photo.unliked_by @user2
         @photo.reload
       }.to change{ @photo.likes.size }.by(-1)
    end

    it "should be findable through user likes" do
    expect{ @user2.liked? @photo }.to be_true
    expect(@user2.find_liked_items).to include(@photo)
    end

  end

end
