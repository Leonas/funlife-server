require 'spec_helper'

describe ConversationMessagesController do
  before do
    login_user
    @conversation = create(:conversation)
    @conversation.users << @current_user
  end

  describe "GET to #index" do
    before { get :index, conversation_id: @conversation.id }
    it { should assign_to(:conversation) }
    it { should assign_to(:conversation_messages) }
    it { should respond_with(:success) }
  end

  describe "POST to #create" do
    it "should create new message" do
      expect{
        post :create,
             conversation_id: @conversation.id,
             conversation_message: attributes_for(:conversation_message)
      }.to change(ConversationMessage, :count).by(1)
    end
  end
end
