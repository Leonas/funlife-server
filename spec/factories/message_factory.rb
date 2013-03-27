require 'faker'

FactoryGirl.define do
  factory :chat_message do
    user
    chat
    message { Faker::Lorem.sentence(5)  }
  end
end
