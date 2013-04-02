class Category < ActiveRecord::Base
  # - Mass Assignment Security
  attr_accessible :name

  # - Validations
  validates :name, presence: true, uniqueness: true

  # - Associations
  has_many :activity_categories, dependent: :destroy
  has_many :activities, through: :activity_categories
end
