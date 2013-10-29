require 'spec_helper'

describe ConversationsController do
  before do
    login_user
    @conversation = create(:conversation)
    @conversation.users << @current_user
  end

  let(:user) { create(:user) }

  context "POST to #create" do
    let(:create_conversation) do
      post :create, conversation: attributes_for(:conversation).merge(user_ids: user.id)
    end

    it "must have at least 2 users" do
      false
    end

    it "must have a starting message" do
      false
    end



    it "should create a new conversation" do
      expect{create_conversation}.to change(Conversation, :count).by(1)
    end

    it "should create a row in conversation_user join table for each user" do
      expect{create_conversation}.to change(ConversationUser, :count).by(2)
    end

  end



  describe "DELETE to #destroy" do

    let(:delete_conversation) do
      delete :destroy, id: @conversation.id
    end

    it "should not destroy the actual conversation" do
      expect{delete_conversation}.to change(Conversation, :count).by(0)
    end

    it "should only remove 1 row in conversation_user join table" do
      expect{delete_conversation}.to change(ConversationUser, :count).by(-1)
    end

    context "a new message gets sent in the same conversation" do

      xit "should add back the row in the conversation_user join table" do
        expect{something}.to change(ConversationUser, :count).by(1)
      end

    end

  end

end
