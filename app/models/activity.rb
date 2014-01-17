class Activity < ActiveRecord::Base

  has_paper_trail
  acts_as_votable

  has_many :activity_place_joins
  has_many :activity_event_joins
  has_many :places,                   through: :activity_place_joins
  has_many :events,                   through: :activity_event_joins, conditions: { visibility: "everyone" }


  # might use pluck here so we can just find activities that are currently used:
  # http://guides.rubyonrails.org/active_record_querying.html#pluck

end
