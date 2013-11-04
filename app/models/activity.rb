class Activity < ActiveRecord::Base

  has_many :activity_category_joins
  #has_many :activity_event_joins



  attr_accessible :name,
                  :icon_url


end
