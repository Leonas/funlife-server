require 'spec_helper'

describe Conversation do
  it { should have_many(:users).through(:conversation_users) }

  context "when two users are in a conversation" do
    before do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @conversation1 = Factory.create(:conversation, users: [@user1, @user2])
    end

    it "has both users in a conversation"   do expect(@conversation1.users).to match_array([@user1, @user2]) end
    it "can be accessed through @user1"     do expect(@user1.conversations.first).to eq(@conversation1)      end
    it "is the only conversation in @user1" do expect(@user1.conversations.length).to equal(1)               end
    it "can be accessed through @user2"     do expect(@user2.conversations.first).to eq(@conversation1)      end
    it "is the only conversation in @user2" do expect(@user1.conversations.length).to equal(1)               end

    xit "must have at least 2 users"   do expect(Factory.create(:conversation_)) end
    xit "must have a starting message" do false end
  end
end
