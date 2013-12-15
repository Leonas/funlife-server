class ConversationSerializer < ActiveModel::Serializer
  attributes :id,
             :users,
             :latest_message,
             :date

  def date
    object.conversation_messages.last.updated_at.strftime("%b %d,  %I:%M%P")
  end

  def users
    @users = object.user_ids - [scope.current_user.id]
    @users.map { |user| User.find(user).name }
  end

  def latest_message
   object.conversation_messages.last.body
  end

end
