# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :friendship do
    friend_id 1
    follower_id 1
  end
end
