##this isnt correct but a trial of how it could be
#
#require 'spec_helper'
#require 'rspec_api_documentation/dsl'
#
#resource "Users" do
#  header "Accept", "application/json"
#  header "Content-Type", "application/json"
#
#  let(:user) { User.create(:email => "chub934@gmau.com", :password => "dubdubdub") }
#
#
#  post "/users" do
#    parameter :email, "User email"
#    parameter :password, "User password"
#
#    required_parameters :email, :password
#
#    let(:email) { "chub934@gmau.com" }
#    let(:password) { "dubdubdub" }
#
#
#    let(:raw_post) { params.to_json }
#
#
#    scope_parameters :user, :all        #this makes it like user: {email: cow, password: bob}
#
#    example_request "Creating an account" do
#      explanation "Email and password are sent. Email and Token are received"
#      response_body.should be_json_eql({
#
#                                           user: {
#                                               email: email,
#                                               token: JSON.parse(response_body)['user']['token']
#                                           }
#                                       }.to_json)
#      status.should == 201
#
#    end
#  end
#
#end