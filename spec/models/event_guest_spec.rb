require 'spec_helper'

describe EventGuest do

  it "should have a working factory" do
    expect(Factory.build(:event_guest)).to be_valid
  end


end
