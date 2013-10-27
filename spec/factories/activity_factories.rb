# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :activity do
    user
    address { Faker::Address.street_address }
    allow_join false
    maximum_users 1
    waitlist "none"
    cost "9.99"
    everyone false
    women false
    men false
    verified false
    trusted false

    factory :activity_step2 do
      headline { Faker::Name.name }
      details {Faker::Lorem.sentence(10)}
      date "2013-03-27"
      start_time "2013-03-27 14:31:23"
      end_time "2013-03-27 14:31:23"
    end

    factory :public_activity do
      allow_join true
    end
  end
end

FactoryGirl.define do
  factory :category do
    name {Faker::Name.name}
  end
end


FactoryGirl.define do
  factory :activity_category do
    activity nil
    category nil
  end
end