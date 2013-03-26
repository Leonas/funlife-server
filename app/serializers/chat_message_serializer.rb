class ChatMessageSerializer < ActiveModel::Serializer
  attributes :id, :message, :user
end
