require "spec_helper"

describe CategoriesController do
  before do
    login_user
  end

  describe "GET to #index" do
    before do
      create(:category)
      get :index
    end

    it { should assign_to(:categories) }
    it { should respond_with(:success) }
  end
end
