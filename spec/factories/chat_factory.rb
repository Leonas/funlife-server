require 'faker'

FactoryGirl.define do
  factory :chat do
    users { Faker::Internet.email }            #These need fixing
    messages { Faker::Lorem.sentence(5)  }
  end
end
