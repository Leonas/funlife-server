require 'spec_helper'

describe UsersController do

  describe "GET to #index" do
    before do
      get :index
    end
    it { should assign_to(:users) }
    it { should respond_with(:success) }
  end

  describe "actions with authentication required" do
    before do
      login_user
    end

    describe "POST to #create" do

      it "should create a new user" do
        expect{
          post :create, user: attributes_for(:user)
        }.to change(User, :count).by(1)
      end

      it "respond with successf if pass valid attrs" do
        post :create, user: attributes_for(:user)
        should respond_with(:created)
      end

      it "respond with error if pass invalid attrs" do
        post :create, user: {}
        should respond_with(:unprocessable_entity)
      end


    end

    describe "PUT to #update" do
      it "should update the user" do
        put :update, id: @current_user.id, user: { email: "roberto@firebase.co"}
        should respond_with(:no_content)
      end

      it "shoudl no update the user with invalid params" do
        put :update, id: @current_user.id, user: { email: ""}
        should respond_with(:unprocessable_entity)
      end
    end
  end
end
