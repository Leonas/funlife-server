require 'spec_helper'

describe Conversation do
  it { should have_many(:users).through(:conversation_users) }

  context "when two users are in a conversation" do
    before do
      @user1 = create(:user)
      @user2 = create(:user)
      @conversation1 = create(:conversation, users: [@user1, @user2])
    end

     it "has both users in a conversation" do
       expect(@conversation1.users).to eq([@user1, @user2])
     end

     it "can be accessed through @user1" do
       expect(@user1.conversations.first).to eq(@conversation1)
     end

    it "is the only conversation in @user1" do
      expect(@user1.conversations.length).to equal(1)
    end

    it "can be accessed through @user2" do
      expect(@user2.conversations.first).to eq(@conversation1)
    end

    it "is the only conversation in @user2" do
      expect(@user2.conversations.length).to equal(1)
    end
  end
end
