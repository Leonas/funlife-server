class Activity < ActiveRecord::Base

  has_many :activity_place_joins
  has_many :activity_event_joins
  has_many :places,                   through: :activity_place_joins
  has_many :events,                   through: :activity_event_joins


  attr_accessible :name,
                  :icon_url


end
