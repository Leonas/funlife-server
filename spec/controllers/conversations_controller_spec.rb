require 'spec_helper'

describe ConversationsController do
  before do
    login_user
  end

  describe "GET to #index" do
    before do
      get :index
    end

    it { should assign_to(:conversations) }
    it { should respond_with(:success) }
  end

  describe "with a existing conversation" do
    before do
      @conversation = create(:conversation)
      @conversation.users << @current_user
    end

    let(:user) { create(:user) }

    def conversation_attrs
      attributes_for(:conversation).merge(user_ids: user.id)
    end

    describe "GET to #show" do
      before do
        get :show, id: @conversation.id
      end

      it { should assign_to(:conversation) }
      it { should respond_with(:success) }

    end

    describe "POST to #create" do

      it "should create a new conversation" do
        expect{
          post :create, conversation: conversation_attrs
        }.to change(Conversation, :count).by(1)
      end

      it "should create a new conversation" do
        post :create, conversation: conversation_attrs
        should respond_with(:created)
      end

      it "should create a new user conversation" do
        expect{
          post :create, conversation: conversation_attrs
        }.to change(ConversationUser, :count).by(2) # Current user and a new user to conversation
      end

      it "response should containts the user ids" do
        post :create, conversation: conversation_attrs
        response.body.should include "\"user_ids\":[#{user.id}]"
      end

      it "response should containts the user ids" do
        post :create, conversation: conversation_attrs
        response.body.should include "\"user_ids\":[#{user.id}]"
      end
      it "response should containts the user ids" do
        post :create, conversation: conversation_attrs
        response.body.should include "\"name\":\"#{user.full_name}\""
      end
    end

    describe "DELETE to #destroy" do

      it "should destroy a new conversation" do
        expect{
          delete :destroy, id: @conversation.id
        }.to change(Conversation, :count).by(-1)
      end

      it "should destroy a new user conversation" do
        expect{
          delete :destroy, id: @conversation.id
        }.to change(ConversationUser, :count).by(-2) # two users
      end

    end

  end
end
