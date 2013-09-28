#require 'spec_helper'
#require 'rspec_api_documentation/dsl'
#
#resource "Sessions" do
#
#  header "Accept", "application/json"
#  header "Content-Type", "application/json"
#
#  let(:email)    { "email@email.com" }
#  let(:password) { "example" }
#  let(:raw_post) { params.to_json }
#
#
#  post "/sessions" do
#    parameter :email,    "User email",    required: true, scope: :user
#    parameter :password, "User password", required: true, scope: :user
#
#    example_request "Create a session (login)" do
#      explanation "A user logs in"
#      response_body.should be_json_eql({
#
#                                           user: {
#                                               email: email,
#                                               followers_count: 0,
#                                               following_count: 0,
#                                               name: " ",
#                                               token: JSON.parse(response_body)['user']['token']
#                                           }
#
#                                       }.to_json)
#      status.should == 201
#    end
#  end
#
#  delete "/sessions" do
#    example_request "Destroy a session (logout)" do
#      explanation "A user logs out"
#      status.should == 204
#    end
#  end
#
#end
