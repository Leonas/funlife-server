require 'spec_helper'

describe User do

  let(:user) { Factory.create(:user) }


  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email) }

  it { should allow_value('a@b.com').for(:email) }
  it { should_not allow_mass_assignment_of(:token) }
  it { should_not allow_mass_assignment_of(:password_digest) }

  it { should have_many(:attendees).dependent(:destroy) }
  it { should have_many(:attended_activities).through(:attendees) }


  #describe User do
  #  it "orders by last name" do
  #    lindeman = User.create!(first_name: "Andy", last_name: "Lindeman")
  #    chelimsky = User.create!(first_name: "David", last_name: "Chelimsky")
  #
  #    expect(User.ordered_by_last_name).to eq([chelimsky, lindeman])
  #  end
  #end

  it "ensure_authentication_token assign token before save" do
    user.token.should_not be_empty
  end

  it "should reset authentication token" do
    user.reset_authentication_token
    user.token_changed?.should be true
  end

  it "should return tru reset_authentication_token!" do
    user.reset_authentication_token!.should be true
  end

  it "should list the activities for a user and his friends, also the public activities" do
    user = Factory.create(:user)
    friend = Factory.create(:user)
    user.followings << friend

    user_activity = Factory.create(:activity, user_id: user.id)
    friend_activity = Factory.create(:activity, user_id: friend.id)
    public_activity = Factory.create(:activity, allow_join: true)

    feed_activities = user.feed_activities
    feed_activities.should include user_activity
    feed_activities.should include friend_activity
    feed_activities.should include public_activity
  end

  it "should list the following photos" do
    user = Factory.create(:user)
    friend = Factory.create(:user)
    user.followings << friend

    photo = Factory.create(:photo, user_id: friend.id)

    user.following_photos.should include photo
  end

end
