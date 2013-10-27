require 'faker'

FactoryGirl.define do
  factory :conversation do
    after(:build) do |conversation|
      conversation.users << FactoryGirl.build(:user)
    end
  end
end


FactoryGirl.define do
  factory :conversation_message do
    user
    conversation
    message { Faker::Lorem.sentence(5)  }
  end
end


FactoryGirl.define do
  factory :user_conversation do
    conversation nil
    user nil
  end
end
