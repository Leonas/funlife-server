require 'faker'

FactoryGirl.define do
  factory :chats do
    users { Faker::Internet.email }            #These need fixing
    messages { Faker::Internet.user_name }
  end
end
