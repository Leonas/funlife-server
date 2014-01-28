require 'spec_helper'

describe EventsController do

  before do
    @user1 = Factory.create(:user)
    login_user(@user1)
  end

  let(:event) { Factory.create(:future_event) }

  describe "GET to #index" do
    before do
      event
      get :index
    end
    it { should respond_with(:success) }
  end



  describe "GET to #show" do
    before do
      @event = Factory.create(:future_event)
      Factory.create(:event_guest, event: @event)
      get :show, id: @event.id
    end
    it{ should respond_with(:success) }
  end



  describe "POST to #create" do
    it "should create a new event" do
      expect{
        post :create, event: Factory.attributes_for(:future_event)
      }.to change(Event, :count).by(1)
    end
  end



  describe "PUT to #update" do

    before do
      @event_to_update = Factory.create(:future_event, admins: [@user1])
    end

    it "should update the event" do
      put :update, id: @event_to_update.id, event: Factory.attributes_for(:future_event)
      should respond_with(:success)
    end

  end


  describe "DELETE to #destroy" do

    before(:each) do
      @event_to_delete = Factory.create(:future_event, admins: [@user1])
    end

    it "should destroy an event" do
      expect{ delete :destroy, id: @event_to_delete.id}.to change(Event, :count).by(-1)
    end

    it "should respond with no content" do
      delete :destroy, id: @event_to_delete.id
      should respond_with(:no_content)
    end

  end
end
