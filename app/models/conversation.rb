class Conversation < ActiveRecord::Base

  has_many :conversation_users,    dependent: :destroy
  has_many :conversation_messages, dependent: :destroy
  has_many :users,                 through: :conversation_users

  attr_accessible :user_ids

  #the only attributes this has now is id and created at
end
