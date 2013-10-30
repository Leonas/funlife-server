require 'spec_helper'

describe ConversationsController do

  describe "GET to #index" do
    before(:each) do
      @user1 = Factory.create(:user)
      @user2 = Factory.create(:user)
      @user3 = Factory.create(:user)
      Timecop.freeze(Date.today + 1) do  @conversation1 = Factory.create(:conversation, users: [@user1, @user2]) end
      Timecop.freeze(Date.today + 2) do  @conversation2 = Factory.create(:conversation, users: [@user1, @user2]) end
      Timecop.freeze(Date.today + 3) do  @conversation3 = Factory.create(:conversation, users: [@user1, @user2]) end
      Timecop.freeze(Date.today + 3) do  @conversation4 = Factory.create(:conversation, users: [@user2, @user3]) end
    end

    it "populates an array of conversations" do
      login_user(@user1)
      get :index
      assigns(:conversations).should eq([@conversation1, @conversation2, @conversation3])
    end

    it "populates an array of conversations on different user" do
      login_user(@user2)
      get :index
      assigns(:conversations).should eq([@conversation1, @conversation2, @conversation3, @conversation4])
    end

    it "should display the user's conversations in chronological order" do
       login_user(@user1)
       get :index
       correct_dates = [@conversation1["updated_at"].strftime("%b %d,  %I:%M%P"),
                        @conversation2["updated_at"].strftime("%b %d,  %I:%M%P"),
                        @conversation3["updated_at"].strftime("%b %d,  %I:%M%P")]
       response_dates = []
       JSON.parse(response.body)["conversations"].each do |conversation|
         response_dates << conversation["updated_at"]
       end
       expect(response_dates).to match_array(correct_dates)
    end
  end
  #
  #@conversation = Factory.create(:conversation, users: [@current_user, @user2])
  #@convo_attributes = Factory.Factory.attributes_for(:conversation)
  #describe "GET #index" do
  #  it "populates an array of contacts" do
  #    contact = Factory(:contact)
  #    get :index
  #    assigns(:contacts).should eq([contact])
  #  end
  #
  #describe "POST to #create" do
  #  let(:create_conversation) do
  #    post :create, conversation: Factory.attributes_for(:conversation).merge(user_ids: @user2.id)
  #  end
  #
  #
  #  it "should create a new conversation" do
  #    expect{create_conversation}.to change(Conversation, :count).by(1)
  #  end
  #
  #  it "should create a row in conversation_user join table for each user" do
  #    expect{create_conversation}.to change(ConversationUser, :count).by(2)
  #  end
  #
  #end
  #
  #
  #
  #describe "DELETE to #destroy" do
  #
  #  let(:delete_conversation) do
  #    delete :destroy, id: @conversation.id
  #  end
  #
  #  it "should not destroy the actual conversation" do
  #    expect{delete_conversation}.to change(Conversation, :count).by(0)
  #  end
  #
  #  it "should only remove 1 row in conversation_user join table" do
  #    expect{delete_conversation}.to change(ConversationUser, :count).by(-1)
  #  end
  #
  #  context "a new message gets sent in the same conversation" do
  #
  #    xit "should add back the row in the conversation_user join table" do
  #      expect{something}.to change(ConversationUser, :count).by(1)
  #    end
  #
  #  end
  #
  #end

end
