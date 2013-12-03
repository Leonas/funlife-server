require 'spec_helper'

describe Place do
  it "should have a working factory" do
    expect(Factory.build(:place)).to be_valid
  end

  context "with two places and a user" do
    let!(:setup) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @place1 = Factory.create(:place)
      @place2 = Factory.create(:place)
    end

    it "should allow a user to add the place to their favorites" do
      expect{@user1.likes(@place1)}.to change{@place1.likes.size}.by(1)
    end

    it "should allow a user to unfavorite a place" do
      @user1.likes @place1
      expect{ @user1.unlike @place1 }.to change{@place1.likes.size}.by(-1)
    end

    it "should show a list of users who favorited a place" do
      @user1.likes @place2
      @user2.likes @place2
      expect(@place2.likes.size).to eq(2)
      expect(@place2.up_votes.first.voter).to eq(@user1)     #order is wrong in this gem
    end

    it "should show the favorite places for a user" do
      @user1.likes @place1
      expect( @user1.find_up_votes_for_class(Place).size ).to eq(1)
    end
  end





end
