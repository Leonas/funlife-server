class Attendee < ActiveRecord::Base
  # - Associations
  belongs_to :user
  belongs_to :activity, counter_cache: true

  # - Mass Assignment Security
  attr_accessible :user_id, :activity_id

  # - Validations
  validates :activity_id, :uniqueness => { :scope => :user_id }
  validate :uninvated_users_cannot_join, unless: Proc.new{ |a| a.activity.allow_join }

  def uninvated_users_cannot_join
    unless self.activity.guest_ids.include?(self.user_id)
      errors.add(:user, "can't join if not already invited")
    end
  end
end
