# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :friendship do
    friend_id {create(:user).id}
    follower_id {create(:user).id}
  end
end
