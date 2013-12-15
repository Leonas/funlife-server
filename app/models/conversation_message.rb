class ConversationMessage < ActiveRecord::Base

  belongs_to :user
  belongs_to :conversation

  validates_presence_of :body
  validates_presence_of :user
  validates_presence_of :conversation

  after_create :unhide_conversation_for_all
  after_create :update_conversation_timestamp

  def self.created_before(time)
    where("created_at < ?", time)
  end

  def unhide_conversation_for_all
    ConversationUserJoin.where(conversation_id: conversation_id).each do |conversation_link|
      conversation_link.update_attributes(hidden: false)
    end
  end

  def update_conversation_timestamp
    conversation.update_attributes(updated_at: self.created_at)
  end

end
