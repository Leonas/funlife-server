class Place < ActiveRecord::Base
  belongs_to :location, polymorphic: true
  has_many :photos, as: :imageable
  has_many :activity_place_joins
  has_many :activities, through: :activity_place_joins

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
