require 'faker'

FactoryGirl.define do

  factory :conversation do
    after(:build) do |conversation|
      conversation.users << FactoryGirl.build(:user)
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


def create_conversation_with_users(*users)
  convo = FactoryGirl.create(:conversation)
  users.each do |user|
    convo.users << user
  end
  convo
end

def create_conversation_message(user, conversation, message)
   #just use the factory for this
end