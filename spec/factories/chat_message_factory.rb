require 'faker'

FactoryGirl.define do
  factory :conversation_message do
    user
    conversation
    message { Faker::Lorem.sentence(5)  }
  end
end
