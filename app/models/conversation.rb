class Conversation < ActiveRecord::Base

  has_many :conversation_users,    dependent: :destroy
  has_many :conversation_messages, dependent: :destroy
  has_many :users,                 through: :conversation_users

  attr_accessible :user_ids

  validates_presence_of :conversation_messages
  validates :users, length: { minimum: 2}
  #the only attributes this has now is id and created at
end
