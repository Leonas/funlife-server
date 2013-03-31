# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :comment do
    user
    photo
    body { Faker::Lorem.sentence(10) }
    parent_id nil
  end
end
