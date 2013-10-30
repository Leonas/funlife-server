require 'spec_helper'

describe Attendee do
  it { should belong_to(:user) }
  it { should belong_to(:activity) }

  it "validates uninvited_users_cannot_join" do
    activity = Factory.create(:activity_step2)
    user = Factory.create(:user)
    attendee = Factory.build(:attendee, activity_id: activity.id, user_id: user.id)
    attendee.should_not be_valid
  end

  it "user can join to public activities" do
    user = Factory.create(:user)
    activity = Factory.create(:activity_step2, allow_join: true)
    attendee = Factory.build(:attendee, activity_id: activity.id, user_id: user.id)
    attendee.should be_valid
  end
end
