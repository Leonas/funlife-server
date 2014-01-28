FactoryGirl.define do
  factory :activity do
    name { "running" }
    icon_url { "www.cloudinary.com/running.jpg" }

    ignore do
      events nil
      places nil
    end

    after(:build) do |activity, evaluator|

      if evaluator.events
        evaluator.events.each do |event|
          activity.events << event
        end
      end

      if evaluator.places
        evaluator.places.each do |place|
          activity.places << place
        end
      end

    end

  end
end