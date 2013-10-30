class ConversationSerializer < ActiveModel::Serializer
  attributes :id, :updated_at, :user_ids, :name, :photo

  def updated_at
    object.updated_at.strftime("%b %d,  %I:%M%P")
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
