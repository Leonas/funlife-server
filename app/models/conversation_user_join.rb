class ConversationUserJoin < ActiveRecord::Base

 # attr_accessible :hidden          #hides the conversation when delete pressed

  belongs_to :conversation
  belongs_to :user

  validates_uniqueness_of :conversation_id, scope: :user_id
end
