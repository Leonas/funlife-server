class ChatMessageSerializer < ActiveModel::Serializer
  attributes :id, :message, :user_id
end
