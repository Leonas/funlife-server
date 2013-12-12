require 'spec_helper'

describe EventsController do
  before do
    login_user
  end
  let(:event) { Factory.create(:event, user_id: @current_user.id) }

  describe "GET to #index" do
    before do
      event
      get :index
    end

    it{ should respond_with(:success) }

    it "should include the pagination attrs" do
      JSON.parse(response.body)["meta"].should == {"total_records"=>1, "total_pages"=>1, "current_page"=>1}
    end
  end


  describe "GET to #show" do
    before do
      @event = Factory.create(:event_step2, user_id: @current_user.id)
      @user = Factory.create(:user)
      @event.guests << @user
      @event.users << @user
      get :show, id: @event.id
    end

    xit{ should assign_to(:event) }
    it{ should respond_with(:success) }

    it "should include the guest ids" do
      JSON.parse(response.body)["event"]["guest_ids"].should include @user.id
    end

    it "should include the atteendes count" do
      JSON.parse(response.body)["event"]["attendees_count"].should == 1
    end
  end

  describe "POST to #create" do
    it "should create a new event" do
      expect{
        post :create, event: Factory.attributes_for(:event)
      }.to change(Event, :count).by(1)
    end

    it "should respond with error if there are invalid attrs" do
      post :create, event: Factory.attributes_for(:event, address: nil)
      should respond_with(:unprocessable_entity)
    end
  end


  describe "PUT to #update" do
    it "should update the user" do
      put :update, id: event.id, event: Factory.attributes_for(:event_step2)
      should respond_with(:success)
    end

    it "should no update the user with invalid attrs" do
      put :update, id: event.id, event: { headline: nil }
      should respond_with(:unprocessable_entity)
    end

    it "should add categories to the events" do
      expect{
        category = Factory.create(:category)
        put :update, id: event.id, event: Factory.attributes_for(:event_step2).merge({ category_ids: [category.id] })
      }.to change(EventCategory, :count).by(1)
    end
  end

  describe "DELETE to #destroy" do
    it "should destroy and event" do
      expect{
        delete :destroy, id: event.id
      }.to change(Event, :count).by(0)
    end

    it "should respond with no content" do
      delete :destroy, id: event.id
      should respond_with(:no_content)
    end

  end
end
