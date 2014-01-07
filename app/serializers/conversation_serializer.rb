class ConversationSerializer < ActiveModel::Serializer
  attributes :id


  has_many :users,                 serializer: UserMiniSerializer
  has_many :conversation_messages, serializer: ConversationMessageSerializer



end
