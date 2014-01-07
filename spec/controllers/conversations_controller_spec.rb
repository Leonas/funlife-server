require 'spec_helper'

describe ConversationsController do

  describe "GET to #index" do
    context "when 3 users and 4 conversations on different days" do
      before(:each) do
        @user1 = Factory.create(:user)
        @user2 = Factory.create(:user)
        @user3 = Factory.create(:user)
        @conversation1 = Factory.create(:conversation, users: [@user1, @user2], created_at: 1.day.from_now)
        @conversation2 = Factory.create(:conversation, users: [@user1, @user2], created_at: 2.days.from_now)
        @conversation3 = Factory.create(:conversation, users: [@user1, @user2], created_at: 3.days.from_now)
        @conversation4 = Factory.create(:conversation, users: [@user2, @user3], created_at: 3.days.from_now)
        login_user(@user1)
        get :index
      end

      it "populates an array of conversations on user1" do
        expect(@user1.conversations).to eq([@conversation3, @conversation2, @conversation1])
      end

      it "populates an array of conversations on user2" do
        expect(@user2.conversations).to eq([@conversation4, @conversation3, @conversation2, @conversation1])
      end

      it "should display the user's conversations in chronological order" do
        response_dates = []
        JSON.parse(response.body)["conversations"].each { |conversation| response_dates << conversation["created_at"] }
        expect(response_dates).to match_array(response_dates.sort)
      end
    end
  end



  describe "POST to #create" do

    let(:create_conversation) do
      @current_user = login_user
      @user2 = Factory.create(:user)
      @user3 = Factory.create(:user)

      post :create, conversation: {
          users: [@user2.id, @user3.id],
          text: "hello"
      }
    end

    it "should create a new conversation" do
      expect{create_conversation}.to change(Conversation, :count).by(1)
    end

    it "should create a row in conversation_user_join table for each user" do
      expect{create_conversation}.to change(ConversationUserJoin, :count).by(3)
    end

    it "should create a new conversation message" do
      expect{create_conversation}.to change(ConversationMessage, :count).by(1)
    end
  end



  describe "GET to #show" do

    before do
      @current_user = login_user
      @user2 = Factory.create(:user)
      @conversation = Factory.create(:conversation, users: [@current_user, @user2], text: "message1")
      get :show, id: @conversation.id
    end

    it "finds the correct conversation" do
      expect(assigns(:conversation)).to eq(@conversation)
    end

    it "finds the correct number of messages" do
      expect(@conversation.conversation_messages).to have(1).item
    end

  end



  describe "POST to #create_message" do

    it "should create new message" do
      @current_user = login_user
      @user2 = Factory.create(:user)
      @conversation = Factory.create(:conversation, users: [@current_user, @user2], text: "message1")

      expect {

        post :create_message,
             id: @conversation.id,
             text: "message2"

      }.to change(ConversationMessage, :count).by(1)
    end
  end


  describe "DELETE to #destroy" do

    before(:each) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @user3 = Factory.create(:user)
      @conversation1 = Factory.create(:conversation, users: [@user1, @user2], created_at: 1.day.from_now)
      @conversation2 = Factory.create(:conversation, users: [@user1, @user2], created_at: 2.days.from_now)
      @conversation3 = Factory.create(:conversation, users: [@user1, @user2], created_at: 3.days.from_now)
      @conversation4 = Factory.create(:conversation, users: [@user2, @user3], created_at: 3.days.from_now)
      login_user(@user1)
    end

    let(:delete_conversation_1) { delete :destroy, id: @conversation1.id }

    it "should NOT destroy the actual conversation" do
      expect{delete_conversation_1}.to change(Conversation, :count).by(0)
    end

    it "should NOT delete anything from the ConversationUser table" do
      expect{delete_conversation_1}.to change(ConversationUserJoin, :count).by(0)
    end

    it "should hide the conversation for the current user" do
      convo_count = @user1.conversations.count
      delete_conversation_1
      expect(@user1.conversations.count).to eq(convo_count - 1)
    end


    it "should un-hide when a new message is sent" do
      convo_count = @user1.conversations.count
      delete_conversation_1
      @user2.send_message_to_conversation(@conversation1, "Yoyo")
      expect(@user1.conversations.count).to eq(convo_count)
    end

  end

end
