require 'spec_helper'

describe Photo do
  before do

    @photo = Factory.create(:photo)
    @user = Factory.create(:user)
  end

  it "should return true a photo was liked" do
    Factory.create(:like, photo_id: @photo.id, user_id: @user.id)
    @photo.liked?(@user).should == true
  end

  it "#toogle_like create a new like" do
    expect{
      @photo.toogle_like(@user)
    }.to change(Like, :count).by(1)
  end

  it "#toogle_like destroy a like" do
      @photo.toogle_like(@user)
    expect{
      @photo.toogle_like(@user)
    }.to change(Like, :count).by(0)
  end
end
