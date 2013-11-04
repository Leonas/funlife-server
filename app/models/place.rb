class Place < ActiveRecord::Base
  belongs_to :location, polymorphic: true
  has_many :photos, as: :imageable
  has_many :activities, as: :activity_type

  attr_accessible :name,
                  :street_address,
                  :zip_code,
                  :city,
                  :longitude,
                  :latitude,
                  :time_open,
                  :time_close,
                  :phone,
                  :summary,
                  :description,
                  :featured


end
