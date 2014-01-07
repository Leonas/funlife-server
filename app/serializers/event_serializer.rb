class EventSerializer < ActiveModel::Serializer
  attributes :id,
             :title,
             :details,
             :start_time,
             :end_time,
             :cover_photo_id

  has_many :admins
  has_many :guests
  has_many :categories, serializer: CategoriesSerializer

  def start_time
    object.start_time.try{ |x| x.strftime("%I:%M%p") }
  end

  def end_time
    object.end_time.try{ |x| x.strftime("%I:%M%p") }
  end

end
