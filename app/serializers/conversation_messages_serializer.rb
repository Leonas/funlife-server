class ConversationMessagesSerializer < ActiveModel::Serializer
  attributes :users
  has_many :conversation_messages

  def users
    @users = object.user_ids
    @users.map { |user| User.find(user).name }
  end

  def latest_message
    object.conversation_messages.order("created_by DESC").limit(1).first.body
  end

  #def conversation_messages
  #  object.conversation_messages.reverse
  #end

end
