require 'faker'

FactoryGirl.define do

  factory :conversation do

    ignore do
      created_by nil
      users   nil
      text    nil
    end

    after(:build) do |conversation, evaluator|

      if evaluator.created_by
        conversation.users << evaluator.created_by
      else
        conversation.users << create(:user)
      end

      if evaluator.users && conversation.users
        (conversation.users).concat(evaluator.users)
      else
        conversation.users << create(:user)
      end

      if evaluator.text
        conversation.conversation_messages << create(:conversation_message, conversation: conversation, user: conversation.users.first, text: evaluator.text)
      else
        conversation.conversation_messages << create(:conversation_message, conversation: conversation, user: conversation.users.first)
      end

    end
  end


  factory :conversation_message do
    association :user
    association :conversation
    text { Faker::Lorem.sentence(5)  }
  end




end