require 'spec_helper'

describe ActivitiesController do
  before do
    login_user
  end
  let(:activity) { create(:activity, user_id: @current_user.id) }

  describe "GET to #index" do
    before do
      get :index
    end

    it{ should assign_to(:activities) }
    it{ should respond_with(:success) }
  end

  describe "GET to #show" do
    before do
      @activity = create(:activity, user_id: @current_user.id)
      get :show, id: @activity.id
    end

    it{ should assign_to(:activity) }
    it{ should respond_with(:success) }
  end

  describe "POST to #create" do
    it "should create a new activity" do
      expect{
        post :create, activity: attributes_for(:activity)
      }.to change(Activity, :count).by(1)
    end

    it "should respond with error if there are invalid attrs" do
      post :create, activity: attributes_for(:activity, headline: nil)
      should respond_with(:unprocessable_entity)
    end
  end


  describe "PUT to #update" do
    it "should update the user" do
      put :update, id: activity.id, activity: { headline: "MyHeadline" }
      should respond_with(:no_content)
    end

    it "should no update the user with invalid attrs" do
      put :update, id: activity.id, activity: { headline: nil }
      should respond_with(:unprocessable_entity)
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
