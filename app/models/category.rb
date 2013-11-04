class Category < ActiveRecord::Base

  has_and_belongs_to_many :activities

  attr_accessible :name

  validates :name, presence: true, uniqueness: true


end
