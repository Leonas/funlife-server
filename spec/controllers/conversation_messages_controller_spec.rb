require 'spec_helper'

describe ConversationMessagesController do
  before do
    @current_user = login_user
    @conversation = Factory.create(:conversation, created_by:@current_user, message: "message1")
  end

  describe "GET to #index" do
    before do
  get :index, conversation_id: @conversation.id
    end

    it "finds the correct conversation"       do expect(assigns(:conversation)).to eq(@conversation)     end
    it "finds the correct number of messages" do expect(assigns(:conversation_messages)).to have(1).item end
  end

  describe "POST to #create" do

    it "should create new message" do
      expect{

        post :create,
             conversation_id: @conversation.id,
                 body: "message2"

      }.to change(ConversationMessage, :count).by(1)
    end
  end
end
