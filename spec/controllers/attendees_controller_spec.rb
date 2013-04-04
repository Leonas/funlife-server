require "spec_helper"

describe AttendeesController do
  before do
    login_user
  end

  describe "GET to #index" do
    before do
      @activity = create(:public_activity)
      @activity.users << @current_user
      get :index, activity_id: @activity.id
    end

    it { should assign_to(:activity) }
    it { should assign_to(:users) }
    it { should respond_with(:success) }
  end

  describe "POST to #join" do
    it "should create a new atteende" do
      expect{
        public_activity = create(:public_activity)
        post :create, activity_id: public_activity.id
      }.to change(Attendee, :count).by(1)
    end

    it "respond with error if pass invalid attrs" do
      public_activity = create(:activity)
      post :create, activity_id: public_activity.id
      should respond_with(:unprocessable_entity)
    end
  end
end
