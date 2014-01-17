class ConversationMessageSerializer < ActiveModel::Serializer

  # object=Conversation.instance(x)

  attributes :id,
             :user_id,
             :date,
             :name,
             :text

  #replace this with has one user

  def name
    object.user.name
  end

  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end
end
