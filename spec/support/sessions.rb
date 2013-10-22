def login_user(user = nil)
  @current_user = user || FactoryGirl.create(:user)
  @request.env['HTTP_ACCEPT'] = 'application/json'
  @request.env['HTTP_AUTHORIZATION'] = "Basic " + Base64::encode64("#{@current_user.token}:me")
end

