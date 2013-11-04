class Category < ActiveRecord::Base
  # - Mass Assignment Security
  attr_accessible :name

  # - Validations
  validates :name, presence: true, uniqueness: true

  # - Associations
  has_many :activities, dependent: :destroy
  has_many :events, through: :activity_categories
end
