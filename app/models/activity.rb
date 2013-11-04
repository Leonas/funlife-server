class Activity < ActiveRecord::Base

  belongs_to :activity_type, polymorphic: true
  has_and_belongs_to_many :categories

  attr_accessible :name,
                  :icon_url


end
