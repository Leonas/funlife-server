FactoryGirl.define do
  factory :event do

  end

  factory :random_future_event, parent: :event do
    title      { Faker::Lorem.sentence(2) }
    details    { Faker::Lorem.sentences(4) }
    date       { rand(10).days.from_now }
    #start_time { }
    #end_time
    #duration
    visibility "everyone"
    min_age    { rand(18..30) }
    max_age    { rand(40..50) }
    activated  true
  end
end