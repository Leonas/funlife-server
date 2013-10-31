require 'spec_helper'

describe Conversation do

  it { should have_many(:users).through(:conversation_users) }

  it "must have at least 2 users"   do expect(Factory.create(:conversation, created_by: @user1, message: "hello")).to raise_error end
  it "must have a starting message" do expect(Factory.create(:conversation, created_by: @user1, to_users: [@user2])).to raise_error end

  context "when two users are in a conversation" do
    before do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @conversation = Factory.create(:conversation, created_by: @user1, to_users: [@user2], message: "hello")
    end

    it "has both users in a conversation"  do expect(@conversation.users).to match_array([@user1, @user2])  end
    it "can be accessed through user1"     do expect(@user1.conversations.first).to eq(@conversation)       end
    it "is the only conversation in user1" do expect(@user1.conversations.length).to equal(1)               end
    it "can be accessed through user2"     do expect(@user2.conversations.first).to eq(@conversation)       end
    it "is the only conversation in user2" do expect(@user1.conversations.length).to equal(1)               end

  end
end
