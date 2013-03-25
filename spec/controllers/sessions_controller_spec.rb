require 'spec_helper'

describe SessionsController do
  let(:user) { create(:user, password: "secret2013") }

  describe "POST to #create" do
    it "should create a session" do
      post :create, user: { email: user.email, password: "secret2013" }
      should respond_with(:success)
    end

    it "response should containts the user token" do
      post :create, user: { email: user.email, password: "secret2013" }
      response.body.should include user.token
    end
  end

  describe "DELETE to #destroy" do
    it "should reset the authentication token" do
      login_user
      delete :destroy
      should respond_with(:no_content)
    end
  end
end
