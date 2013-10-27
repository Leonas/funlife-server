# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :friendship do
    following_id {create(:user).id}
    follower_id {create(:user).id}
  end
end
