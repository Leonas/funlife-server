require 'faker'

FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    password { Faker::Internet.password 10  }
  end

  factory :user_with_location, parent: :user do
    longitude { Faker::Address.longitude }
    latitude  { Faker::Address.latitude  }
  end
end