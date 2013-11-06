class Category < ActiveRecord::Base

  has_many :activity_category_joins
  has_many :activities,               through: :activity_category_joins

  attr_accessible :name

  validates :name, presence: true, uniqueness: true


end
