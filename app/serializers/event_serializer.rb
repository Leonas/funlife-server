class EventSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :details,
             :start_time,
             :end_time,
             :cover_photo_id

  has_many :admins, each_serializer: UserMiniSerializer
  has_many :invited, each_serializer: UserMiniSerializer
  has_many :attending, each_serializer: UserMiniSerializer
  has_many :activities, each_serializer: ActivityIconsSerializer

  def start_time
    object.start_time.try{ |x| x.strftime("%I:%M%p") }
  end

  def end_time
    object.end_time.try{ |x| x.strftime("%I:%M%p") }
  end

end
