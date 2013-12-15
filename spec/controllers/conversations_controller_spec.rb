require 'spec_helper'

describe ConversationsController do

  describe "GET to #index" do
    context "when 3 users and 4 conversations on different days" do
      before(:each) do
        @user1 = Factory.create(:user)
        @user2 = Factory.create(:user)
        @user3 = Factory.create(:user)
        Timecop.freeze(Date.today + 1) do  @conversation1 = Factory.create(:conversation, users: [@user1, @user2]) end
        Timecop.freeze(Date.today + 2) do  @conversation2 = Factory.create(:conversation, users: [@user1, @user2]) end
        Timecop.freeze(Date.today + 3) do  @conversation3 = Factory.create(:conversation, users: [@user1, @user2]) end
        Timecop.freeze(Date.today + 3) do  @conversation4 = Factory.create(:conversation, users: [@user2, @user3]) end
        login_user(@user1)
        get :index
      end

      it "populates an array of conversations on user1" do
        assigns(:conversations).should eq([@conversation3, @conversation2, @conversation1])
      end

      it "populates an array of conversations on user2" do
        assigns(:conversations).should eq([@conversation4, @conversation3, @conversation2, @conversation1])
      end

      it "should display the user's conversations in chronological order" do
        response_dates = []
        JSON.parse(response.body)["conversations"].each { |conversation| response_dates << conversation["updated_at"] }
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
          user_ids: [@user2.id, @user3.id],
          message: "hello"
      }
    end

    it "should create a new conversation"                                  do expect{create_conversation}.to change(Conversation, :count).by(1) end
    it "should create a row in conversation_user join table for each user" do expect{create_conversation}.to change(ConversationUserJoin, :count).by(3) end
    it "should create a new conversation message"                          do expect{create_conversation}.to change(ConversationMessage, :count).by(1) end


  end



  describe "DELETE to #destroy" do

    before(:each) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @user3 = Factory.create(:user)
      Timecop.freeze(Date.today + 1) do
        @conversation1 = Factory.create(:conversation, users: [@user1, @user2])
      end
      Timecop.freeze(Date.today + 2) do
        @conversation2 = Factory.create(:conversation, users: [@user1, @user2])
      end
      Timecop.freeze(Date.today + 3) do
        @conversation3 = Factory.create(:conversation, users: [@user1, @user2])
      end
      Timecop.freeze(Date.today + 3) do
        @conversation4 = Factory.create(:conversation, users: [@user2, @user3])
      end
    end

    let(:delete_conversation1) do delete :destroy, id: @conversation1.id end

    it "should NOT destroy the actual conversation"           do expect{delete_conversation1}.to change(Conversation, :count).by(0) end
    it "should NOT delete anything from the ConversationUser table" do expect{delete_conversation1}.to change(ConversationUserJoin, :count).by(0) end

    it "should hide the conversation for the current user"   do
      convo_count = @user1.conversations.count
      delete_conversation1
      expect(@user1.conversations.count).to eq(convo_count - 1)
    end


    it "should un-hide when a new message is sent" do
      convo_count = @user1.conversations.count
      delete_conversation1
      @user2.send_message(@conversation1, "Yoyo")
      expect(@user1.conversations.count).to eq(convo_count)

    end

  end

end
