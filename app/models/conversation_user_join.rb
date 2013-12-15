class ConversationUserJoin < ActiveRecord::Base

 # attr_accessible :hidden          #hides the conversation when delete pressed

  belongs_to :conversation
  belongs_to :user

  before_validation :set_default_attributes

  validates_uniqueness_of :conversation_id, scope: :user_id

  #def self.default_scope             #best not to use this
  #  where(hidden: false)
  #end

  def set_default_attributes
    self.hidden = false if hidden.nil?
  end
end
