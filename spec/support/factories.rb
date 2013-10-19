def token
  current_user = FactoryGirl.create(:user)
  "Basic " + Base64::encode64("#{current_user.token}:me")
end

def random_email
  current_user = FactoryGirl.build(:user)
  current_user.email
end

def build_user
  FactoryGirl.build(:user)
end

def create_user
  FactoryGirl.create(:user)
end