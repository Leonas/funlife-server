class ConversationMessageSerializer < ActiveModel::Serializer
  attributes :id, :message, :name, :user_id, :date

  def name
    object.user.full_name
  end

  def include_name?
    object.user_id != scope.current_user.id
  end

  def date
    object.created_at.strftime("%m %d,  %I:%M%p")
  end
end
