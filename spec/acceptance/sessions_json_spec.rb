require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Sessions" do

  header "Accept", "application/json"
  header "Content-Type", "application/json"

  before do
    @user1 = Factory.create(:user)
  end

  ######################################
  post "/sessions" do ##################
  ######################################
    parameter :email,    "User email",    scope: :user, required: true
    parameter :password, "User password", scope: :user, required: true

    let(:email)    { @user1.email }
    let(:password) { @user1.password }
    let(:raw_post) { params.to_json }

    example_request "Create a session (login)" do
      explanation "A user logs in"
      response_body.should include_json({

        user: {
          token: JSON.parse(response_body)['user']['token']
        }

      }.to_json)
      status.should == 200
    end
  end





  ######################################
  delete "/sessions" do ################
  ######################################

    header "Authorization", generate_token(@user1)

    example_request "Destroy a session (logout)" do
      explanation "A user logs out"
      status.should == 204
    end
  end

end

