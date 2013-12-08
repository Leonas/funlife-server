class Conversation < ActiveRecord::Base

  has_many :conversation_user_joins,    dependent: :destroy
  has_many :conversation_messages,      dependent: :destroy
  has_many :users,                      through: :conversation_user_joins


  validates_presence_of :conversation_messages
  validates :users, length: { minimum: 2 }
end
