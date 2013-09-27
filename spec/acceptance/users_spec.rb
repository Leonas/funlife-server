#this isnt correct but a trial of how it could be

require 'spec_helper'
require 'rspec_api_documentation/dsl'

resource "Users" do

  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let(:user) { User.create(:email => "chub934@gmau.com", :password => "dubdubdub") }


  post "/users" do
    parameter :email,    "User email",    required: true, scope: :user
    parameter :password, "User password", required: true, scope: :user

    let(:email)    { "email@email.com" }
    let(:password) { "example" }


    let(:raw_post) { params.to_json }


    example_request "Creating an account" do
      explanation "Email and password are sent. Email and Token are received"
      response_body.should be_json_eql({

                                           user: {
                                               email: email,
                                               followers_count: 0,
                                               following_count: 0,
                                               name: " ",
                                               token: JSON.parse(response_body)['user']['token']
                                           }
                                       }.to_json)
      status.should == 201

    end
  end

end
