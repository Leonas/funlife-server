require 'faker'

FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    password { Faker::Internet.user_name }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
  end
end


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

def user2
  @user2 ||= FactoryGirl.create(:user)
end

def user3
  @user3 ||= FactoryGirl.create(:user)
end

def login_user(user = nil)
  @current_user = user || FactoryGirl.create(:user)
  @request.env['HTTP_ACCEPT'] = 'application/json'
  @request.env['HTTP_AUTHORIZATION'] = "Basic " + Base64::encode64("#{@current_user.token}:me")
end


def create_3_users
  @user1 = FactoryGirl.create(:user)
  @user2 = FactoryGirl.create(:user)
  @user3 = FactoryGirl.create(:user)
end