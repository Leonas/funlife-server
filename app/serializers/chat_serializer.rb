class ChatSerializer < ActiveModel::Serializer
  embed :ids
  attributes :id

  has_many :users

end
