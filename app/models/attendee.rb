class Attendee < ActiveRecord::Base
  # - Associations
  belongs_to :user
  belongs_to :event, counter_cache: true

  # - Mass Assignment Security
  attr_accessible :user_id, :activity_id

  # - Validations
  validates :activity_id, :uniqueness => { :scope => :user_id }
  validate :uninvited_users_cannot_join, unless: Proc.new{ |a| a.event.allow_join }

  def uninvited_users_cannot_join
    unless self.event.guest_ids.include?(self.user_id)
      errors.add(:user, "can't join if not already invited")
    end
  end
end
