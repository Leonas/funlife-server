class Activity < ActiveRecord::Base

  WAITLIST = %w(none everyone unverified untrusted)

  # - Mass Assignment Security
  attr_accessible :allow_join, :cost, :details, :end_time, :headline,
    :maximum_users, :pick_time, :pick_date, :start_time, :visibility, :waitlist,
    :everyone, :women, :men, :verified, :trusted, :star_age, :end_age

  # - Associations
  belongs_to :user

  # - Validations
  validates :headline, presence: true
  validates :pick_time, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :waitlist, inclusion: { in: WAITLIST }
end
