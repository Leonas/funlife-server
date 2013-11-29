require 'spec_helper'

describe Event do
  xit { should have_many(:invitations).dependent(:destroy) }
  xit { should have_many(:guests).through(:invitations) }

  describe "#by_pick_date" do
    xit "should returns all the events without date" do
      event = Factory.create(:event)
      Event.by_pick_date.should include event
    end

    xit "should returns the events with the specified date" do
      event = Factory.create(:event)
      Event.by_pick_date(Date.tomorrow).should_not include event
      event = Factory.create(:event, date: Date.tomorrow)
      Event.by_pick_date(Date.tomorrow).should include event
    end
  end
end
