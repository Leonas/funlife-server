class Attendee < ActiveRecord::Base

  belongs_to :user
  belongs_to :event, counter_cache: true


  attr_accessible :user_id, :event_id


  validates :event_id, :uniqueness => { :scope => :user_id }
  validate :uninvited_users_cannot_join, unless: Proc.new{ |a| a.event.allow_join }

  def uninvited_users_cannot_join
    unless self.event.guest_ids.include?(self.user_id)
      errors.add(:user, "can't join if not already invited")
    end
  end
end
