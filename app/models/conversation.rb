class Conversation < ActiveRecord::Base
  # Associations
  has_many :conversation_users, dependent: :destroy
  has_many :users, through: :conversation_users
  has_many :conversation_messages, dependent: :destroy

  attr_accessible :user_ids, :unread
end
