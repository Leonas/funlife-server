class Activity < ActiveRecord::Base

  WAITLIST = %w(none everyone unverified untrusted)

  # - Mass Assignment Security
  attr_accessible :allow_join, :cost, :details, :end_time, :headline,
    :maximum_users, :date, :start_time, :visibility, :waitlist,
    :everyone, :women, :men, :verified, :trusted, :star_age, :end_age,
    :address

  # - Associations
  belongs_to :user

  # - Validations
  validates :headline, presence: true, on: :update
  validates :date, presence: true, on: :update
  validates :start_time, presence: true, on: :update
  validates :end_time, presence: true, on: :update
  validates :waitlist, inclusion: { in: WAITLIST }
  validates :address, presence: true

  # - Class Methods
  class << self
    def by_pick_date(date = nil)
      date ? where(date: date) : all
    end
  end


end
