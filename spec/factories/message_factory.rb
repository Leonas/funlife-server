require 'faker'

FactoryGirl.define do
  factory :chat_message do
    message { Faker::Lorem.sentence(5)  }
  end
end
