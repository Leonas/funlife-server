require 'faker'

FactoryGirl.define do

  factory :conversation do

    ignore do
      created_by nil
      to_users   nil
      message    nil
    end

    after(:build) do |conversation, evaluator|

      if evaluator.created_by
        conversation.users << evaluator.created_by
      else
        conversation.users << create(:user)
      end

      if evaluator.to_users && conversation.users
        (conversation.users).concat(evaluator.to_users)
      else
        conversation.users << create(:user)
      end

      if evaluator.message
        conversation.conversation_messages << create(:conversation_message, conversation: conversation, user: conversation.users.first, message: evaluator.message)
      else
        conversation.conversation_messages << create(:conversation_message, conversation: conversation, user: conversation.users.first)
      end

    end
  end


  factory :conversation_message do
    association :user
    association :conversation
    message { Faker::Lorem.sentence(5)  }

    ignore do
      time_travel nil
    end

    before(:create) do |message, evaluator|
        Timecop.freeze(Date.today + evaluator.time_travel) if evaluator.time_travel
    end
    after(:create) do |message, evaluator|
      Timecop.return if evaluator.time_travel
    end
  end




end