def generate_token(user = nil)
  token_user = user || FactoryGirl.create(:user)
  "Basic " + Base64::encode64("#{token_user.token}:me")
end


def login_user(user = nil)
  @current_user               = user || FactoryGirl.create(:user)
  @request.env['HTTP_ACCEPT'] = 'application/json'
  @request.env['HTTP_AUTHORIZATION'] = "Basic " + Base64::encode64("#{@current_user.token}:me")
  @current_user
end