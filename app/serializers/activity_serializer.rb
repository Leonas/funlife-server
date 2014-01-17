class ActivitySerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :icon_url

  has_many :events, each_serializer: EventSerializer
  has_many :places, each_serializer: PlaceSerializer


end
