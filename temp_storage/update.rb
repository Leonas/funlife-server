Given(/^I have a "(.*?)"$/) do |new_password|
#  new_password
end

When(/^I post the token, "(.*?)", and "(.*?)"$/) do |old_password, new_password|
#  @response = HTTParty.post('http://localhost:3000/users', body: { user: {email: @email, password: @password } })
end

Then(/^my password gets changed to the "(.*?)"$/) do |new_password|
#  @response.inspect
#  @response.inspect['user']['password'].should new_password
end