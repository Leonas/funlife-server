class ConversationMessageSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :date, :name, :message

  def name
    object.user.name
  end

  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end
end
