class ConversationInboxSerializer < ActiveModel::Serializer
  attributes :id,
             :newest_message,
             :date

  has_many :users, each_serializer: UserMiniSerializer

  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end

  def newest_message
   object.conversation_messages.newest.text
  end

end
