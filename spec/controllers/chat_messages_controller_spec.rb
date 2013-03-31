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

  describe "GET to #index of existing chat" do
    before do
      post :create,
           chat_id: @chat.id,
           chat_message: attributes_for(:chat_message)

      post :create,
           chat_id: @chat.id,
           chat_message: attributes_for(:chat_message)

      get :index, chat_id: @chat.id

      @messages = JSON.parse(response.body)['chat_messages']

    end


    it "should have an id for each message" do
      @messages.each do |response|
        response['id'].should be >= 0
      end
    end

    it "should have a body for each message" do
      @messages.each do |response|
        response['message'].length.should >= 1
      end
    end

    it "should have a user_id for each message" do
      @messages.each do |response|
        response['user_id'].should >= 1
      end
    end

    it "should have a time for each message" do
      @messages.each do |response|
        response['time'].length.should > 3
      end
    end

    it "should have a photo url for each message" do
      JSON.parse(response.body)['chat_messages'].each do |response|
        response['photo'].length.should > 4
      end
    end

  end

  describe "POST to #create" do
    it "should create new message" do
      expect{
        post :create,
             chat_id: @chat.id,
             chat_message: attributes_for(:chat_message)
      }.to change(ChatMessage, :count).by(1)
    end

    it "should respond with created" do
      post :create,
           chat_id: @chat.id,
           chat_message: attributes_for(:chat_message)
      should respond_with(:created)
    end

    it "should respond with an error if posted invalid attributes" do
      post :create, chat_id: @chat.id, chat_message: {}
      should respond_with(:unprocessable_entity)
    end

    it "should respond with a nicely formatted time created" do
      post :create,
           chat_id: @chat.id,
           chat_message: attributes_for(:chat_message)
      JSON.parse(response.body)['message']['time'].should_not be_nil
    end
  end


end
