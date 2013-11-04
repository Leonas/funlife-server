class Activity < ActiveRecord::Base
  # Associations
  belongs_to :activity_type, polymorphic: true

  attr_accessible :name,
                  :icon_url

  # make sure its included only once per category
  #validates_uniqueness_of :activity_id, scope: :category_id
end
