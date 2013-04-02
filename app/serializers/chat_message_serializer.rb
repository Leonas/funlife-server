class ChatMessageSerializer < ActiveModel::Serializer
  attributes :id, :message, :name, :user_id

  def name
    object.user.full_name
  end

  def include_name?
    object.user_id != scope.current_user.id
  end
end
