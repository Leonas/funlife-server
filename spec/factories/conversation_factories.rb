require 'faker'

FactoryGirl.define do

  factory :conversation do

    ignore do
      users nil
      conversation_messages nil
    end

    after(:build) do |conversation, evaluator|
      if evaluator.users
        evaluator.users.each do |user|
          FactoryGirl.create(:conversation_user, conversation: conversation.id, user: user)
          conversation.users << user
        end
      end

      if evaluator.conversation_messages
        evaluator.conversation_messages.each do |message|
          conversation.conversation_message << message
        end
      end

    end
  end


  factory :conversation_message do
    user
    conversation
    message { Faker::Lorem.sentence(5)  }
  end


  factory :conversation_user do
    conversation nil
    user nil
  end

end