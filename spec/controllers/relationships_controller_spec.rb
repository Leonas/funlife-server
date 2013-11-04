require "spec_helper"

describe RelationshipsController do


  let(:user1) { Factory.create(:user) }
  let(:user2) { Factory.create(:user) }

  before { login_user user1 }

  describe "creating a relationship" do

    it "should increment the Relationship count" do
      expect do
        post :create, user_id: user2.id
      end.to change(Relationship, :count).by(1)
    end

    it "should respond with success" do
      post :create, user_id: user2.id
      response.should be_success
    end

    it "should set the cached counters" do
      post :create, user_id: user2.id
      user1.reload.following_count.should == 1
      user2.reload.followers_count.should == 1
    end
  end


  describe "destroying a relationship" do

    before do
      user1.follow!(user2)
    end


    it "should decrement the Relationship count" do
      expect do
        delete :destroy, user_id: user2.id
      end.to change(Relationship, :count).by(-1)
    end

    it "should respond with success" do
      delete :destroy, user_id: user2.id
      response.should be_success
    end
  end
end
