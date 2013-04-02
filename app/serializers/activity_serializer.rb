class ActivitySerializer < ActiveModel::Serializer
  attributes :id, :headline, :details, :date, :start_time, :end_time, :allow_join, :maximum_users, :waitlist, :cost, :address
  has_one :user, embed: :ids
  has_many :categories, embed: :objects

  def start_time
    object.start_time.try{ |x| x.strftime("%I:%M%p") }
  end

  def end_time
    object.end_time.try{ |x| x.strftime("%I:%M%p") }
  end
end
