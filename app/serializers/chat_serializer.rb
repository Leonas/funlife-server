class ChatSerializer < ActiveModel::Serializer
  attributes :id, :date, :user_ids, :name, :photo

  def date
    object.created_at.strftime("%m %d,  %I:%M%p")
  end

  def user_ids
    object.user_ids - [scope.current_user.id]
  end

  def name
    (object.users - [scope.current_user]).first.full_name
  end

  def photo
    (object.users - [scope.current_user]).first.try(:profile_photo).try(:url)
  end

end
