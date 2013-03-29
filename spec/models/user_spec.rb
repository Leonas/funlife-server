require 'spec_helper'

describe User do

  let(:user) { create(:user) }

  xit { should validate_presence_of(:first_name) }
  xit { should validate_presence_of(:last_name) }

  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email) }

  xit { should_not allow_value('noregex').for(:email) }

  it { should allow_value('a@b.com').for(:email) }
  it { should_not allow_mass_assignment_of(:token) }
  it { should_not allow_mass_assignment_of(:password_digest) }

  xit { should ensure_inclusion_of(:age).in_range(13..120) }

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
    user = create(:user)
    friend = create(:user)
    user.friends << friend

    user_activity = create(:activity, user_id: user.id)
    friend_activity = create(:activity, user_id: friend.id)
    public_activity = create(:activity, allow_join: true)

    feed_activities = user.feed_activities
    feed_activities.should include user_activity
    feed_activities.should include friend_activity
    feed_activities.should include public_activity

  end

end
