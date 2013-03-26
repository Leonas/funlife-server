require 'spec_helper'

describe ChatMessagesController do
  before do
    login_user
    @chat = create(:chat)
    @chat.users << @current_user
  end

  describe "GET to #index" do
    before do
      get :index, chat_id: @chat.id
    end

    it { should assign_to(:chat) }
    it { should assign_to(:chat_messages) }
    it { should respond_with(:success) }
  end

  describe "POST to #create" do
    it "should create new message" do
      expect{
        post :create, chat_id: @chat.id, chat_message: attributes_for(:chat_message)
      }.to change(ChatMessage, :count).by(1)
    end

    it "should respond with created" do
      post :create, chat_id: @chat.id, chat_message: attributes_for(:chat_message)
      should respond_with(:created)
    end
  end
end
