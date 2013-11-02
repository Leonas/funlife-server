require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Relationships" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let(:create_users) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
  end




  ######################################
  post "/relationships" do #############
  ######################################
    header "Authorization", :token
    parameter :follow_user, "user_id to follow", scope: :user, required: true

    let(:token) { login_user(@user1) }
    let(:follow_user) { @user2.id }
    let(:raw_post) { params.to_json }

    example_request "Follow a user" do
      explanation "Follows a user"

      status.should == 200
    end
  end




  ######################################
  delete "/relationships" do ###########
  ######################################

    header "Authorization", :token
    parameter :unfollow_user, "user_id to unfollow", required: true

    let(:token) { login_user(@user1) }
    let(:unfollow_user) { @user2.id }
    let(:raw_post) { params.to_json }

    example_request "Unfollow a user" do
      explanation "User is no longer followed"
      status.should == 204
    end
  end
end
