def token(user = FactoryGirl.create(:user))
  "Basic " + Base64::encode64("#{user.token}:me")
end

def random_email
  current_user = FactoryGirl.build(:user)
  current_user.email
end

def build_user
  FactoryGirl.build(:user)
end

def user1
  @user1 ||= FactoryGirl.create(:user)
end
