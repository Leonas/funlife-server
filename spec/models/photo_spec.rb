require 'spec_helper'

describe Photo do
  it "should return true a photo was liked" do
    photo = create(:photo)
    user = create(:user)
    create(:like, photo_id: photo.id, user_id: user.id)
    photo.liked?(user).should == true
  end
end
