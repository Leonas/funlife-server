require 'spec_helper'

describe Activity do

  it "should have a working factory" do
    expect(Factory.build(:activity)).to be_valid
  end

end
