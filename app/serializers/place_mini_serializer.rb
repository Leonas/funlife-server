class PlaceMiniSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :street_address,
             :zip_code,
             :city,
             :longitude,
             :latitude,
             :time_open,
             :time_close,
             :phone,
             :description,
             :favorited_by


  has_many :activities, each_serializer: ActivityIconsSerializer
  has_many :photos, each_serializer: PhotoSerializer


end
