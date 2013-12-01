class Event < ActiveRecord::Base

  VISIBILITIES = ["all", "none", "women", "men"]

  attr_accessible :title,
                  :details,
                  :date,
                  :start_time,
                  :end_time,
                  :duration,
                  :visibility,
                  :hidden,
                  :min_age,
                  :max_age,
                  :activated


  has_one  :place,                as: :location
  has_many :activity_event_joins
  has_many :activities,           through: :activity_event_joins
  has_many :event_guests,         dependent: :destroy
  has_many :users,                through: :event_guests

   validates :visiblity, inclusion: { in: VISIBILITIES, allow_nil: false}

  def activate!
    #if all items filled out, then set to active
  end

  def activated?

  end

end
