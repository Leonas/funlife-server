require 'spec_helper'

describe Conversation do


  it "should have a working factory" do
    expect(Factory.build(:conversation)).to be_valid
  end


  it { should have_many(:users).through(:conversation_user_joins) }

  before(:each) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @conversation = Factory.create(:conversation, created_by: @user1, users: [@user2], text: "hello")
  end

  it "must have at least 2 users"   do
    @conversation.users = [@user1]
    expect(@conversation).to_not be_valid
  end

  it "must have a starting message" do
    @conversation.conversation_messages = []
    expect(@conversation).to_not be_valid
  end

  context "when two users are in a conversation" do
    before do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @conversation = Factory.create(:conversation, created_by: @user1, users: [@user2], text: "hello")
    end

    it "has both users in a conversation"  do expect(@conversation.users).to match_array([@user1, @user2])  end
    it "can be accessed through user1"     do expect(@user1.conversations.first).to eq(@conversation)       end
    it "is the only conversation in user1" do expect(@user1.conversations.length).to equal(1)               end
    it "can be accessed through user2"     do expect(@user2.conversations.first).to eq(@conversation)       end
    it "is the only conversation in user2" do expect(@user1.conversations.length).to equal(1)               end

  end
end
