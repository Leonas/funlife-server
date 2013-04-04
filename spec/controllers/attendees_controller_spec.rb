require "spec_helper"

describe AttendeesController do
  before do
    login_user
  end

  describe "GET to #index" do
    before do
      @activity = create(:activity)
      @activity.users << @current_user
      get :index, activity_id: @activity.id
    end

    it { should assign_to(:activity) }
    it { should assign_to(:users) }
    it { should respond_with(:success) }
  end
end
