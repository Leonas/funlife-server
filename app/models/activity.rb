class Activity < ActiveRecord::Base

  WAITLIST = %w(none everyone unverified untrusted)

  # - Mass Assignment Security
  attr_accessible :allow_join, :cost, :details, :end_time, :headline,
    :maximum_users, :date, :start_time, :visibility, :waitlist,
    :everyone, :women, :men, :verified, :trusted, :star_age, :end_age,
    :address, :category_ids

  # - Associations
  belongs_to :user
  has_many :activity_categories, dependent: :destroy
  has_many :categories, through: :activity_categories
  has_many :invitations, dependent: :destroy
  has_many :guests, through: :invitations, source: :user


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
      date ? where(date: date) : self.scoped
    end
  end


end
