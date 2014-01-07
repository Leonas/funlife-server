FactoryGirl.define do
  factory :comment do
    user
    commentable_id
    commentable_type
    text { Faker::Lorem.sentence(10) }
    parent_id nil
  end
end
