#this is the join table for conversations and users
class ConversationUser < ActiveRecord::Base
  # Associations
  belongs_to :conversation
  belongs_to :user

  # Validations
  validates_uniqueness_of :conversation_id, :scope => :user_id
end
