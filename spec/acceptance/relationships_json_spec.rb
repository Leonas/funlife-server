require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Relationships" do
  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:create_users) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @user3 = Factory.create(:user)
    @user1.follow!(@user3)
  end
  let!(:token)       { generate_token(@user1) }



  ######################################
  post "/relationships" do #############
  ######################################
    header "Authorization", :token
    parameter :user_id, "user_id to follow", required: true

    let(:user_id)     { @user2.id }
    let(:raw_post)    { params.to_json }

    example_request "Follow a user" do
      explanation "Follows a user"

      expect(@user1.reload.following_count).to eq(2)
      status.should == 201
    end
  end




  ######################################
  delete "/relationships" do ###########
  ######################################

    header "Authorization", :token
    parameter :user_id, "user_id to unfollow", required: true

    let(:user_id)       { @user3.id }
    let(:raw_post)      { params.to_json }

    example_request "Unfollow a user" do
      explanation "User is no longer followed"

      expect(@user1.reload.following_count).to eq(0)
      status.should == 204
    end
  end
end
