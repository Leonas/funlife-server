
FactoryGirl.define do
  factory :comment_on_user, class: "Comment" do
    association :commentable, factory: :user
    user
    text { Faker::Lorem.sentence(10) }
  end

  factory :comment_on_photo, class: "Comment" do
    association :commentable, factory: :photo
    user
    text { Faker::Lorem.sentence(10) }
  end

  factory :comment_on_event, class: "Comment" do
    association :commentable, factory: :event
    user
    text { Faker::Lorem.sentence(10) }
  end

  factory :comment_on_place, class: "Comment" do
    association :commentable, factory: :place
    user
    text { Faker::Lorem.sentence(10) }
  end
end

#t.integer :commentable_id
#t.string :commentable_type
#t.integer :user_id
#t.integer :parent_id
#t.integer :depth
#t.text :text
#
#t.integer :children_count, default: 0