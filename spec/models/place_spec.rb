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

    it "should allow a person to get added to the meet me here list" do
      expect{@user1.add_favorite_place!(@place1)}.to change{PlaceUserJoin.count}.by(1)
    end

    it "should allow a person to remove themselves from the meet me here list" do
      @user1.add_favorite_place!(@place1)
      expect{@user1.remove_favorite_place!(@place1)}.to change{PlaceUserJoin.count}.by(-1)
    end

    it "should show a list of users who favorited a place" do
      @user1.add_favorite_place!(@place2)
      @user2.add_favorite_place!(@place2)
      expect(@place2.users.all.count).to eq(2)
    end

    it "should show the favorite places for a user" do
      @user1.add_favorite_place!(@place1)
      expect(@user1.favorite_places.length).to eq(1)
    end
  end





end
