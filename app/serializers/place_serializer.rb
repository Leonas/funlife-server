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
             :description

  has_many :favorited_by, each_serializer: UserMiniSerializer
  has_many :activities, each_serializer: ActivityIconsSerializer
  has_many :photos,     each_serializer: PhotoSerializer
  has_many :comments,   each_serializer: CommentSerializer


end
