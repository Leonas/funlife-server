require "spec_helper"

describe ConversationMessage do

  it "should have a working factory" do
    expect(Factory.build(:conversation_message)).to be_valid
  end

  context "when there are two users in one conversation and three messages sent" do
    before(:all) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @conversation = Factory.create(:conversation, created_by: @user1, users: [@user2], text: "message1")
      @user1_message1 = @conversation.conversation_messages.first
      @user2_message1 = Factory.create(:conversation_message, user: @user2, conversation: @conversation, text: "message2", created_at: 1.day.from_now)
      @user2_message2 = Factory.create(:conversation_message, user: @user2, conversation: @conversation, text: "message3", created_at: 2.days.from_now)
    end

    describe "the conversation" do
      it "should have three messages"                do expect(@conversation.conversation_messages.all.length).to eq(3) end
      it "should have two users"                     do expect(@conversation.users.length).to eq(2) end
      it "should return all the messages in the right order" do expect(@conversation.conversation_messages.sorted.all).to eq([@user2_message2, @user2_message1, @user1_message1]) end
      it "should return messages since timestamp"    do expect(@conversation.conversation_messages.created_after(@user1_message1.created_at)).to eq([@user2_message2, @user2_message1]) end
    end

    describe "user1" do
      it "should have one message"                   do expect(@user1.conversation_messages.length).to eq(1) end
      it "should have the correct message text"      do expect(@user1.conversation_messages.newest.text).to eq("message1") end
      it "should see 3 messages in the conversation" do expect(@user1.conversations.newest.conversation_messages.length).to eq(3) end
    end

    describe "user2" do
      it "should have two messages"                  do expect(@user2.conversation_messages.length).to eq(2) end
      it "should have the correct message text"      do expect(@user2.conversation_messages.newest.text).to eq("message3") end
      it "should see 3 messages in the conversation" do
        expect(@user2.conversations.newest.conversation_messages.length).to equal(3)
      end
    end

  end
end
