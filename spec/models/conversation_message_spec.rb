require "spec_helper"

describe ConversationMessage do
  it "should return all the messages" do
    conversation_message = create(:conversation_message)
    ConversationMessage.since.should include conversation_message
  end

  it "should return the lasted messages" do
    create(:conversation_message)
    conversation_message = create(:conversation_message)
    ConversationMessage.since(conversation_message.created_at).should include conversation_message
  end
end
