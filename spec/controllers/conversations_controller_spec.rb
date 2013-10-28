require 'spec_helper'

describe ConversationsController do
  before do
    login_user
    @conversation = create(:conversation)
    @conversation.users << @current_user
  end

  let(:user) { create(:user) }

  describe "POST to #create" do
    let(:create_conversation) do
      post :create, conversation: attributes_for(:conversation).merge(user_ids: user.id)
    end

    it "should create a new conversation" do
      expect{create_conversation}.to change(Conversation, :count).by(1)
    end

    it "should create 2 rows in conversation_user join table" do
      expect{create_conversation}.to change(ConversationUser, :count).by(2)
    end

  end



  describe "DELETE to #destroy" do

    let(:delete_conversation) do
      delete :destroy, id: @conversation.id
    end

    it "should destroy a new conversation" do
      expect{delete_conversation}.to change(Conversation, :count).by(0)
    end

    it "should only remove 1 row in conversation_user join table" do
      expect{delete_conversation}.to change(ConversationUser, :count).by(-1)
    end

  end

end
