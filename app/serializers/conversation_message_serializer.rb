class ConversationMessageSerializer < ActiveModel::Serializer

  # object=Conversation.instance(x)

  attributes :id,
             :user_id,
             :date,
             :name,
             :text

  def name
    object.user.name
  end

  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end
end
