class EventSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :details,
             :start_time,
             :end_time,
             :duration,
             :cover_photo,
             :location

  has_many :activities,    each_serializer: ActivityIconsSerializer
  has_many :photos,        each_serializer: PhotoSerializer
  has_many :admins,        each_serializer: UserMiniSerializer
  has_many :invited,       each_serializer: UserMiniSerializer
  has_many :attending,     each_serializer: UserMiniSerializer
  has_many :not_attending, each_serializer: UserMiniSerializer
  has_many :comments,      each_serializer: CommentSerializer

  def start_time
    object.start_time.try{ |x| x.strftime("%I:%M%p") }
  end

  def end_time
    object.end_time.try{ |x| x.strftime("%I:%M%p") }
  end


end
