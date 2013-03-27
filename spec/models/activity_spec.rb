require 'spec_helper'

describe Activity do
  describe "#by_pick_date" do
    it "should returns all the activities without date" do
      activity = create(:activity)
      Activity.by_pick_date.should include activity
    end

    it "should returns the activities with the specified date" do
      activity = create(:activity)
      Activity.by_pick_date(Date.tomorrow).should_not include activity
      activity = create(:activity, pick_date: Date.tomorrow)
      Activity.by_pick_date(Date.tomorrow).should include activity
    end
  end
end
