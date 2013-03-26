# Chat Rooms
class Chat < ActiveRecord::Base
  # Associations
  has_many :user_chats, dependent: :destroy
  has_many :users, through: :user_chats
  has_many :chat_messages, dependent: :destroy

  attr_accessible :user_ids
end
