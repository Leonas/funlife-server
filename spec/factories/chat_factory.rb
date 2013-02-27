require 'faker'

FactoryGirl.define do
  factory :chat do
    users { Faker::Internet.email }            #These need fixing
    messages { Faker::Internet.user_name }
  end
end
