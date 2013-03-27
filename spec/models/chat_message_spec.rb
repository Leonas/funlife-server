require "spec_helper"

describe ChatMessage do
  it "should returns all the messages" do
    chat_message = create(:chat_message)
    ChatMessage.lasted_messages.should include chat_message
  end

  it "should returns the lasted mesasges" do
    create(:chat_message)
    chat_message = create(:chat_message)
    ChatMessage.lasted_messages(chat_message.created_at).should include chat_message
  end
end
