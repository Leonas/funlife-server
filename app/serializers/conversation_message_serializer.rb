class ConversationMessageSerializer < ActiveModel::Serializer

  # object=Conversation.instance(x)

  attributes :id,
             :date,
             :text


  has_one :user, serializer: UserMiniSerializer

  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end
end
