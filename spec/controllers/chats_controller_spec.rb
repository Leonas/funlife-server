require 'spec_helper'

describe ChatsController do
  before do
    login_user
  end

  describe "GET to #index" do
    before do
      get :index
    end

    it { should assign_to(:chats) }
    it { should respond_with(:success) }
  end

  describe "with a existing chat" do
    before do
      @chat = create(:chat)
      @chat.users << @current_user
    end

    let(:user) { create(:user) }

    def chat_attrs
      attributes_for(:chat).merge(user_ids: user.id)
    end

    describe "GET to #show" do
      before do
        get :show, id: @chat.id
      end

      it { should assign_to(:chat) }
      it { should respond_with(:success) }

    end

    describe "POST to #create" do

      it "should create a new chat" do
        expect{
          post :create, chat: chat_attrs
        }.to change(Chat, :count).by(1)
      end

      it "should create a new chat" do
        post :create, chat: chat_attrs
        should respond_with(:created)
      end

      it "should create a new user chat" do
        expect{
          post :create, chat: chat_attrs
        }.to change(UserChat, :count).by(2) # Current user and a new user to chat
      end

      it "response should containts the user ids" do
        post :create, chat: chat_attrs
        response.body.should include "\"user_ids\":[#{user.id}]"
      end

      it "response should containts the user ids" do
        post :create, chat: chat_attrs
        response.body.should include "\"user_ids\":[#{user.id}]"
      end
      it "response should containts the user ids" do
        post :create, chat: chat_attrs
        response.body.should include "\"name\":\"#{user.full_name}\""
      end
    end

    describe "DELETE to #destroy" do

      it "should destroy a new chat" do
        expect{
          delete :destroy, id: @chat.id
        }.to change(Chat, :count).by(-1)
      end

      it "should destroy a new user chat" do
        expect{
          delete :destroy, id: @chat.id
        }.to change(UserChat, :count).by(-2) # two users
      end

    end

  end
end
