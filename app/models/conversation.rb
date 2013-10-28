class Conversation < ActiveRecord::Base

  has_many :conversation_users,    dependent: :destroy
  has_many :conversation_messages, dependent: :destroy
  has_many :users,                 through: :conversation_users

  attr_accessible :user_ids
end
