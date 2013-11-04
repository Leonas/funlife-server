class ConversationUser < ActiveRecord::Base

  ###############
  #This is the join table for conversations and users
  ##############

  belongs_to :conversation
  belongs_to :user

  validates_uniqueness_of :conversation_id, scope: :user_id
end
