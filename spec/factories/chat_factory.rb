require 'faker'

FactoryGirl.define do
  factory :chat do
    after(:build) do |chat|
      chat.users << FactoryGirl.build(:user)
    end
  end
end
