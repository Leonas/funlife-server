require 'faker'

FactoryGirl.define do
  factory :conversation do
    after(:build) do |conversation|
      conversation.users << FactoryGirl.build(:user)
    end
  end
end
