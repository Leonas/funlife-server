require "spec_helper"

describe ConversationMessage do
  it "should return all the messages" do
    conversation_message = Factory.create(:conversation_message)
    ConversationMessage.since.should include conversation_message
  end

  it "should return the messages since timestamp" do
    Factory.create(:conversation_message)
    conversation_message = Factory.create(:conversation_message)
    ConversationMessage.since(conversation_message.created_at).should include conversation_message
  end

  context "when there are two users in one conversation and three messages sent" do
    before do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @conversation1 = Factory.create(:conversation, users: [@user1, @user2])
      @user1_message1 = Factory.create(:conversation_message, user: @user1, conversation: @conversation1, message: "Gday Mate")
      Timecop.freeze(Date.today + 1) do
        @user2_message1 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, message: "Howdy")
      end
      Timecop.freeze(Date.today + 2) do
        @user2_message2 = Factory.create(:conversation_message, user: @user2, conversation: @conversation1, message: "Wachu up 2")
      end
    end


    describe "the conversation" do
      it "should have three messages" do
        expect(@conversation1.conversation_messages.length).to equal(3)
      end
    end

    describe "@user1" do
      it "should have one message" do
        expect(@user1.conversation_messages.length).to equal(1)
      end

      it "should have the message text as Gday Mate" do
        expect(@user1.conversation_messages.first.message).to eq("Gday Mate")
      end

      it "should be able to see 3 messages in the conversation" do
        expect(@user1.conversations.first.conversation_messages.length).to equal(3)
      end
    end

    describe "@user2" do
      it "should have two messages" do
        expect(@user2.conversation_messages.length).to equal(2)
      end

      it "should have the first message text as Howdy" do
        expect(@user2.conversation_messages.first.message).to eq("Howdy")
      end

      it "should be able to see 3 messages in the conversation" do
        expect(@user2.conversations.first.conversation_messages.length).to equal(3)
      end
    end

  end
end
