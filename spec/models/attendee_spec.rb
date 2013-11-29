require 'spec_helper'

describe Attendee do
  xit { should belong_to(:user) }
  xit { should belong_to(:event) }

  xit "validates uninvited_users_cannot_join" do
    event = Factory.create(:event_step2)
    user = Factory.create(:user)
    attendee = Factory.build(:attendee, event_id: event.id, user_id: user.id)
    attendee.should_not be_valid
  end

  xit "user can join to public events" do
    user = Factory.create(:user)
    event = Factory.create(:event_step2, allow_join: true)
    attendee = Factory.build(:attendee, event_id: event.id, user_id: user.id)
    attendee.should be_valid
  end
end
