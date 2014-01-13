class ConversationUserJoin < ActiveRecord::Base

  has_paper_trail

  belongs_to :conversation
  belongs_to :user

  before_validation :set_default_attributes

  validates_uniqueness_of :conversation_id, scope: :user_id


  def set_default_attributes
    self.hidden = false if hidden.nil?
    true
  end

end
