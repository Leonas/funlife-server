class Category < ActiveRecord::Base
  # - Mass Assignment Security
  attr_accessible :name

  # - Validations
  validates :name, presence: true, uniqueness: true
end
