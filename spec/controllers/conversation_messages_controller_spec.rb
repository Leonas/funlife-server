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

  describe "GET to #index of existing conversation" do
    before do
      2.times{create(:conversation_message, conversation_id: @conversation.id)}
      get :index, conversation_id: @conversation.id
      @messages = JSON.parse(response.body)['conversation_messages']
    end


    it "should have an id for each message" do
      @messages.each do |message|
        expect(message['id']).to be
      end
    end

    it "should have a body for each message" do
      @messages.each do |message|
        expect(message['message']).to be
      end
    end

    it "should have a user_id for each message" do
      @messages.each do |message|
        expect(message['user_id']).to be
      end
    end

    it "should have a timestamp for each message" do
      @messages.each do |message|
        expect(message['time']).to be
      end
    end

    xit "should have a photo url for each message" do
      JSON.parse(response.body)['conversation_messages'].each do |message|
        expect(message['photo']).to be
      end
    end

  end

  describe "POST to #create" do
    it "should create new message" do
      expect{
        post :create,
             conversation_id: @conversation.id,
             conversation_message: attributes_for(:conversation_message)
      }.to change(ConversationMessage, :count).by(1)
    end

    it "should respond with created" do
      post :create,
           conversation_id: @conversation.id,
           conversation_message: attributes_for(:conversation_message)
      should respond_with(:created)
    end

    it "should respond with an error if posted invalid attributes" do
      post :create, conversation_id: @conversation.id, conversation_message: {}
      should respond_with(:unprocessable_entity)
    end

    it "should respond with a nicely formatted time created" do
      post :create,
           conversation_id: @conversation.id,
           conversation_message: attributes_for(:conversation_message)
      JSON.parse(response.body)['conversation_message']['date'].should_not be nil
    end
  end


end
