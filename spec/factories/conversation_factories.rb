require 'faker'

FactoryGirl.define do

  factory :conversation do

    ignore do
      users nil
      conversation_messages nil
    end

    after(:create) do |conversation, evaluator|
      if evaluator.users
        evaluator.users.each do |user|
          conversation.users << user
        end
      else
        conversation.users << Factory.create(:user)
        conversation.users << Factory.create(:user)
      end

      if evaluator.conversation_messages
        evaluator.conversation_messages.each do |message|
          conversation.conversation_message << message
        end
      end

    end
  end

  factory :conversation_invalid, parent: :conversation do
    users nil
    conversation_messages nil
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


#factory :invalid_contact, parent: :contact do |f|
#  f.firstname nil
#end