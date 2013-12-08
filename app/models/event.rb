class Event < ActiveRecord::Base

  VISIBILITIES = ["all", "none", "women", "men"]


  has_one  :place,                as: :location
  has_many :activity_event_joins
  has_many :activities,           through: :activity_event_joins
  has_many :event_guests,         dependent: :destroy
  has_many :users,                through: :event_guests

  def activate!
    #if all items filled out, then set to active
    self.attributes.each do |attribute|
      if attribute.nil?
        return false
      end
    end
    self.activated = true
  end

  def activated?                 #is this necessary?
    self.activated
  end

end
