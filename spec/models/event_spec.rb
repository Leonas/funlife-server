require 'spec_helper'

describe Event do

  it "validates that the start_time is not earlier than the current time" do
    event = Event.new
    expect(event.save).to be_true
    event.start_time = 1.day.ago.to_i
    expect(event.save).to be_false
  end

  it "accepts a valid unix timestamp for start_time" do
    event = Event.new(start_time: 1.day.from_now.to_i)
    expect(event.save).to be_true
  end

  it "validates that the start_time is not later than 1 year from now" do
    event = Event.new(start_time: 370.days.from_now.to_i)
    expect(event.save).to be_false
  end

  it "validates that the end_time is not later than one month from start_date" do
    event = Event.new(start_time: Time.now.utc.to_i, end_time: 32.days.from_now)
    expect(event.save).to be_false
  end


  context "given a start_time and end_time" do

    let(:event1) { Event.new(start_time: 1.day.from_now.to_i, end_time: 5.days.from_now)}

    it "calculates the duration in minutes" do
      event1.save
      expect(event1.duration_minutes).to eq(4.days / 1.minute)
    end

  end

  context "given a start_time and duration" do

    let(:event2) { Event.new(start_time: 1.day.from_now.to_i, duration_minutes: 60.minutes )}

    it "calculates the end_time correctly" do
      event2.save
      expect(event2.end_time).to eq(event2.start_time + 60.minutes)
    end
  end


end
