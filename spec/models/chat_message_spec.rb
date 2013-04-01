require "spec_helper"

describe ChatMessage do
  it "should return all the messages" do
    chat_message = create(:chat_message)
    ChatMessage.since.should include chat_message
  end

  it "should return the lasted messages" do
    create(:chat_message)
    chat_message = create(:chat_message)
    ChatMessage.since(chat_message.created_at).should include chat_message
  end
end
