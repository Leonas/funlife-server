class ChatSerializer < ActiveModel::Serializer
  attributes :id, :date, :user_ids, :name

  def date
    object.created_at.strftime("%m %d,  %I:%M%p")
  end

  def user_ids
    object.user_ids - [scope.current_user.id]
  end

  def name
    (object.users - [scope.current_user]).first.full_name
  end

end
