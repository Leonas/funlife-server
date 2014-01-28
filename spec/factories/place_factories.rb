require 'faker'

FactoryGirl.define do
  factory :place do
    name { Faker::Lorem.sentence }
    street_address { Faker::Address.street_address }
    zip_code { Faker::Address.zip_code }
    city { Faker::Address.city }
    longitude { Faker::Address.longitude }
    latitude { Faker::Address.latitude }
    time_open "8:30am"
    time_close "7pm"
    phone { Faker::PhoneNumber.phone_number }
    description { Faker::Lorem.paragraph(10) }



  end
end
