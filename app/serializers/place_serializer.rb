class PlaceSerializer < ActiveModel::Serializer
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


  has_many :activities, serializer: ActivityIconSerializer
  has_many :photos,     serializer: PhotoSerializer
  has_many :comments,   serializer: CommentSerializer



end
