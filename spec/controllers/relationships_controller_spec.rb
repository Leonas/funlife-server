require "spec_helper"

describe RelationshipsController do
  before do
    login_user
  end

  describe "POST to #create" do
    let(:friend) { Factory.create(:user) }
    it "should create a new follow" do
      expect{
        post :create, following_id: friend.id
      }.to change(Friendship, :count).by(1)
    end

    it "should set the cached counters" do
      post :create, following_id: friend.id
      @current_user.reload.following_count.should == 1
      friend.reload.followers_count.should == 1
    end
  end

  describe "DELETE to #destroy" do

    it "should destroy a follow" do
      expect{
        friendship = Factory.create(:friendship, follower_id: @current_user.id)
        delete :destroy, id: friendship.id
      }.to change(Friendship, :count).by(0)
    end
  end
end
