require 'faker'

FactoryGirl.define do
  factory :place do
    name "Point Reyes National Seashore"
    street_address "Blub road"
    zip_code "423432"
    city "san francisco"
    longitude "34234234"
    latitude "adsasdasd"
    featured true

    has_many photos
    has_many activity_categories



  end
end
