class Event < ActiveRecord::Base

  has_paper_trail

  MAX_DURATION        = 30.days
  LATEST_ALLOWED_DATE = 1.year.from_now

  has_many :photos,               as: :imageable
  has_many :activity_event_joins
  has_many :activities,           through: :activity_event_joins
  has_many :event_guests,         dependent: :destroy
  has_many :users,                through: :event_guests

  validates :visibility, inclusion: { in: ["everyone", "women_only", "men_only", "invite_only"], allow_nil: true }
  validate :start_time_cannot_be_in_the_past
  validate :start_time_less_than_latest_allowed_date
  validate :end_time_cannot_be_in_the_past
  validate :end_time_less_than_max_duration_from_start_time
  validates :duration_minutes, numericality: { only_integer: true, less_than_or_equal_to: (MAX_DURATION / 1.minute) }, allow_nil: true

  before_validation :convert_time_to_correct_format
  before_validation :determine_duration_or_end_time


  ##################################
  # Actions
  ##################################

  #def activate!
  #  #if all items filled out, then set to active1
  #    if attribute.nil?
  #      return false
  #    end
  #  end
  #  self.activated = true
  #end


  ##################################
  # Queries
  ##################################




  ##################################
  # Before Validation
  ##################################

  def determine_duration_or_end_time
   if start_time and (end_time.present? ^ duration_minutes.present?)
     self.duration_minutes = (end_time - start_time) / 1.minute   if end_time.present?
     self.end_time = start_time + duration_minutes                if duration_minutes.present?
   end
  end



  def convert_time_to_correct_format

    if start_time_changed? and start_time.class == Fixnum
      if start_time > 100.years.from_now.to_i
        #this removes the seconds from a javascript time object if that is passed
        self.start_time = start_time / 100
      end
      self.start_time = Time.at(start_time).utc.to_datetime
    end

    if end_time_changed? and end_time.class == Fixnum
      if end_time > 100.years.from_now.to_i
        self.end_time = end_time / 100
      end
      self.end_time = Time.at(end_time).utc.to_datetime
    end

  end




  ##################################
  # Custom Validations
  ##################################

  def start_time_cannot_be_in_the_past
    if start_time.present? and start_time < Time.now
      errors.add(:start_time, "can't be in the past")
    end
  end

  def start_time_less_than_latest_allowed_date
    if start_time.present? and start_time > LATEST_ALLOWED_DATE
      errors.add(:start_time, "is too far in the future")
    end
  end

  def end_time_cannot_be_in_the_past
    if end_time.present? and end_time < Time.now
      errors.add(:end_time, "can't be in the past")
    end
  end

  def end_time_less_than_max_duration_from_start_time
    if end_time.present? and start_time.present? and end_time > start_time + MAX_DURATION
      errors.add(:end_time, "is too long from start time")
    end
  end


end
