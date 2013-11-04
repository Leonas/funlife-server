class Activity < ActiveRecord::Base
  # Associations
  belongs_to :event
  belongs_to :category

  # Validations
  validates_uniqueness_of :activity_id, :scope => :category_id
end
