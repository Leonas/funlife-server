class ChatSerializer < ActiveModel::Serializer
  attributes :id, :date, :user_ids

  def date
    object.created_at.strftime("%m %d,  %I:%M%p")
  end

  def user_ids
    user_ids = object.user_ids
    user_ids.delete(scope.current_user)
    user_ids
  end

end
