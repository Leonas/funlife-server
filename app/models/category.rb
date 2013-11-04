class Category < ActiveRecord::Base
  # - Mass Assignment Security
  attr_accessible :name

  # - Validations
  validates :name, presence: true, uniqueness: true

  # - Associations
  has_many :events, dependent: :destroy
  #has_many :events, through: :event_categories
end
