Given(/^I have an "(.*?)" and "(.*?)"$/) do |email, password|
  @email = email
  @password = password
end

When(/^I post the user info to \/register$/) do
  @response = HTTParty.post('http://localhost:3000/users', body: { user: {email: @email, password: @password } })
end

Then(/^the app makes a password digest$/) do
  @this_is_not_done = true
end

Then(/^The server responds with my email and token$/) do
  puts @response
  @response['user']['email'].should == @email
  expect(@response['user']['token']).not_to be_empty
end