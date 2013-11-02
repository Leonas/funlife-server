require 'spec_helper'

describe UsersController do
  it "should render unauthorized status" do
    put :update, id: "1", user: { email: ""}
    should respond_with(401)
  end

  describe "actions with authentication required" do
    before do
      login_user
    end

    describe "GET to #index" do
      before do
        get :index
      end
      xit{ should assign_to(:users) }
      it { should respond_with(:success) }
    end


    describe "GET to #show" do
      before do
        get :show, id: @current_user.id
      end

      it{ should respond_with(:success) }
      it "response should contain the user token" do
        response.body.should include @current_user.token
      end
    end

    describe "POST to #create" do

      it "should create a new user" do
        expect{
          post :create, user: Factory.attributes_for(:user)
        }.to change(User, :count).by(1)
      end

      it "respond with success if pass valid attrs" do
        post :create, user: Factory.attributes_for(:user)
        should respond_with(:created)
      end

      it "respond with error if pass invalid attrs" do
        post :create, user: {}
        should respond_with(:unprocessable_entity)
      end
    end

    describe "PUT to #update" do
      it "should update the user" do
        put :update, user: { email: "roberto@firebase.co"}
        should respond_with(:no_content)
      end

      it "shoudl no update the user with invalid params" do
        put :update, id: @current_user.id, user: { email: ""}
        should respond_with(:unprocessable_entity)
      end

      it "should update the current_user" do
        put :update, user: { email: "roberto@firebase.co"}
        @current_user.reload.email.should == "roberto@firebase.co"
      end

    end
  end
end
