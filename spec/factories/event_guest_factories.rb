FactoryGirl.define do

  factory :event_guest do
    event
    user
    guest_state "attending"
  end

end
