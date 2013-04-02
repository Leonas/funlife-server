class ActivityCategory < ActiveRecord::Base
  # Associations
  belongs_to :activity
  belongs_to :category

  # Validations
  validates_uniqueness_of :activity_id, :scope => :category_id
end
