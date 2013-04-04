require 'spec_helper'

describe ActivitiesController do
  before do
    login_user
  end
  let(:activity) { create(:activity, user_id: @current_user.id) }

  describe "GET to #index" do
    before do
      activity
      get :index
    end

    it{ should assign_to(:activities) }
    it{ should respond_with(:success) }

    it "should include the pagination attrs" do
      JSON.parse(response.body)["meta"].should == {"total_records"=>1, "total_pages"=>1, "current_page"=>1}
    end
  end

  describe "GET to #feed" do
    before do
      create(:activity, date: Date.today, allow_join: true)
      get :feed, date: Date.today, page: "1"
    end

    it { should assign_to(:activities) }
    it { should respond_with(:success) }

    it "should include the pagination attrs" do
      JSON.parse(response.body)["meta"].should == {"total_records"=>1, "total_pages"=>1, "current_page"=>1}
    end
  end

  describe "GET to #show" do
    before do
      @activity = create(:activity_step2, user_id: @current_user.id)
      @user = create(:user)
      @activity.guests << @user
      @activity.users << @user
      get :show, id: @activity.id
    end

    it{ should assign_to(:activity) }
    it{ should respond_with(:success) }

    it "should include the guest ids" do
      JSON.parse(response.body)["activity"]["guest_ids"].should include @user.id
    end

    it "should include the atteendes count" do
      JSON.parse(response.body)["activity"]["attendees_count"].should == 1
    end
  end

  describe "POST to #create" do
    it "should create a new activity" do
      expect{
        post :create, activity: attributes_for(:activity)
      }.to change(Activity, :count).by(1)
    end

    it "should respond with error if there are invalid attrs" do
      post :create, activity: attributes_for(:activity, address: nil)
      should respond_with(:unprocessable_entity)
    end
  end


  describe "PUT to #update" do
    it "should update the user" do
      put :update, id: activity.id, activity: attributes_for(:activity_step2)
      should respond_with(:success)
    end

    it "should no update the user with invalid attrs" do
      put :update, id: activity.id, activity: { headline: nil }
      should respond_with(:unprocessable_entity)
    end

    it "should add categories to the activities" do
      expect{
        category = create(:category)
        put :update, id: activity.id, activity: attributes_for(:activity_step2).merge({ category_ids: [category.id] })
      }.to change(ActivityCategory, :count).by(1)
    end
  end

  describe "DELETE to #destroy" do
    it "should destroy and activity" do
      expect{
        delete :destroy, id: activity.id
      }.to change(Activity, :count).by(0)
    end

    it "should respond with no content" do
      delete :destroy, id: activity.id
      should respond_with(:no_content)
    end

  end

end
