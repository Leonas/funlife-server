class Attendee < ActiveRecord::Base

  belongs_to :user
  belongs_to :event, counter_cache: true


  attr_accessible :user_id,
                  :event_id


  validates :event_id, uniqueness: { scope: :user_id }

end
