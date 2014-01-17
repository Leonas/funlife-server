require 'spec_helper'

describe EventsController do
  before do
    login_user
  end
  let(:event) { Factory.create(:event) }

  describe "GET to #index" do
    before do
      event
      get :index
    end

    it{ should respond_with(:success) }

  end


  describe "GET to #show" do
    before do
      @event = Factory.create(:random_future_event)
      @user = Factory.create(:user)
      @event.guests << @user
      @event.users << @user
      get :show, id: @event.id
    end

    it{ should respond_with(:success) }

  end

  describe "POST to #create" do
    it "should create a new event" do
      expect{
        post :create, event: Factory.attributes_for(:event)
      }.to change(Event, :count).by(1)
    end

    it "should respond with error if there are invalid attributes" do
      post :create, event: Factory.attributes_for(:event, address: nil)
      should respond_with(:unprocessable_entity)
    end
  end


  describe "PUT to #update" do
    it "should update the event" do
      put :update, id: event.id, event: Factory.attributes_for(:random_future_event)
      should respond_with(:success)
    end

    it "should not update the event with invalid attributes" do
      put :update, id: event.id, event: { title: nil }
      should respond_with(:unprocessable_entity)
    end

  end

  describe "DELETE to #destroy" do
    it "should destroy and event" do
      expect{ delete :destroy, id: event.id}.to change(Event, :count).by(-1)
    end

    it "should respond with no content" do
      expect { delete :destroy, id: event.id }.to respond_with(:no_content)
    end

  end
end
