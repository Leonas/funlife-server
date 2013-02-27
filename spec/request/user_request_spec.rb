##require 'spec_helper'
#

#instead of using the json plugin, I could use:
#post '/foo', data: "here"                                        Need needs to be fixed
#last_response.body.should contain("Hello World")
#This will be using rack test.

#require 'capybara/json'
#include Capybara::Json
#
#Capybara.current_driver = :httpclient_json
#Capybara.app_host = 'http://localhost:3000'
#
#describe 'testing how this works' do
#  it 'gets crunk' do
#    post '/login', {"user" => {"email" => "bob", "password" => "krakow"}} #{ "this is" => "json" } # POST 'http://example.com/'
#    puts json     #=> parsed json response
#    raw_json #=> raw response body
#
#    post '/login', {"user" => {"email" => "asd", "password" => "asd"}} #{ "this is" => "json" } # POST 'http://example.com/'
#    puts json     #=> parsed json response
#
#    get  '/errors/400'
#    status_code #=> 400
##    get! '/errors' #=> raise Capybara::Json::Error
#
#    get  '/errors', {}, { 'header' => '' } # set request headers
#    response_headers #=> get response headers
#  end
#
#  xit 'it should give an error here' do
#    post '/', {"user" => {"email" => "bob", "password" => "krakow"}} #{ "this is" => "json" } # POST 'http://example.com/'
#    puts json     #=> parsed json response
#  end
#end
