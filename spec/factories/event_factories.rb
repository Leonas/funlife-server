FactoryGirl.define do

  factory :event do
    #nothing is required
  end

  factory :future_event, parent: :event do

    ignore do
      admins nil
      invited nil
      join_requested nil
      attending nil
    end


    title      { Faker::Lorem.sentence(2) }
    details    { Faker::Lorem.sentences(4) }
    start_time { rand(5..10).days.from_now }
    end_time   { rand(11..13).days.from_now }
    visibility "everyone"
    min_age    { rand(18..30) }
    max_age    { rand(40..50) }
    activated  true


    after(:build) do |event, evaluator|

      if evaluator.admins
        evaluator.admins.each do |admin|
          event.event_guests.build(user: admin, guest_state: "admin")
        end
      end

      if evaluator.invited
        evaluator.invited.each do |invitee|
          event.event_guests.build(user: invitee, guest_state: "invited")
        end
      end

      if evaluator.join_requested
        evaluator.join_requested.each do |requester|
          event.event_guests.build(user: requester, guest_state: "join_requested")
        end
      end

      if evaluator.attending
        evaluator.attending.each do |attendee|
          event.event_guests.build(user: attendee, guest_state: "attending")
        end
      end

    end

  end

end