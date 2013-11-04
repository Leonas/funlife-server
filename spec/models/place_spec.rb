require 'spec_helper'

describe Place do
  it "should have a working factory" do
    expect(Factory.build(:place)).to be_valid
  end


  let!(:setup) do

  end

  it "should have a list of people who want to meet here" do
    expect()
  end

  it "should allow a person to get added to the meet me here list" do
  expect(@user1.add_fav_place(@place)).to
  end

  it "should allow a person to remove themselves from the meet me here list" do
  expect(@user1.remove_fav_place(@place))
  end


end
