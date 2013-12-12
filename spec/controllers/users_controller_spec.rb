require 'spec_helper'

describe UsersController do

  it "setting blank email should not be allowed" do
    put :update, id: "1", user: { email: ""}
    should respond_with(401)
  end

  describe "POST to #create" do

    it "should create a new user" do
      expect {
        post :create, user: Factory.attributes_for(:user)
      }.to change(User, :count).by(1)
    end

    it "respond with success if pass valid attrs" do
      post :create, user: Factory.attributes_for(:user)
      should respond_with(:created)
    end

    it "respond with error if pass invalid attrs" do
      post :create, user: {}
      should respond_with(:bad_request)
    end
  end

  describe "actions with authentication required" do
    before do
      @user1 = Factory.create(:user)
      login_user(@user1)
    end

    describe "GET to #index" do
      before do
        get :index
      end
      it { should respond_with(:success) }
    end


    describe "GET to #show" do
      before do
        get :show, id: @user1.id
      end

      it{ should respond_with(:success) }
      it "response should contain the user token" do
        response.body.should include @user1.token
      end
    end

    describe "PUT to #update" do

      it "should not update the user with invalid params" do
        put :update, id: @user1.id, user: { email: ""}
        should respond_with(:unprocessable_entity)
      end

      it "should update user1" do
        put :update, id: @user1.id, user: { email: "email@email.com"}
        should respond_with(:no_content)
        @user1.reload.email.should == "email@email.com"
      end

    end
  end
end
