require 'faker'

FactoryGirl.define do
  factory :chat_message do
    users { Faker::Internet.email }            #These need fixing
    messages { Faker::Lorem.sentence(5)  }
  end
end
