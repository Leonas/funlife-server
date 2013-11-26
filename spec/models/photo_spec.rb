require 'spec_helper'

describe Photo do
  before do
    @user1  = Factory.create(:user)
    @user2  = Factory.create(:user)
    @photo =  Factory.create(:photo, uploaded_by: @user1)
  end


  it "toggles likes with toggle_like" do
    expect{ @photo.toggle_like(@user2) }.to change(Like, :count).by(1)
    expect{ @photo.toggle_like(@user2) }.to change(Like, :count).by(-1)
  end
end
