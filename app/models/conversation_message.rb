class ConversationMessage < ActiveRecord::Base

  has_paper_trail

  belongs_to :user
  belongs_to :conversation, inverse_of: :conversation_messages

  validates_presence_of :text
  validates_presence_of :user
  validates_presence_of :conversation

  after_create :unhide_conversation_for_all
  after_create :update_conversation_timestamp

  #################
  # scopes
  #################

  def self.created_before(time)
    where("created_at < ?", time).sorted
  end

  def self.created_after(time)
    where("created_at > ?", time).sorted
  end

  def self.newest
    sorted.limit(1).first
  end

  def self.sorted
    order("created_at DESC")
  end


  ##################
  # Actions
  ##################

  def unhide_conversation_for_all
    ConversationUserJoin.where(conversation_id: conversation_id).each do |conversation_link|
      conversation_link.update_attributes(hidden: false)
    end
  end

  def update_conversation_timestamp
    conversation.update_attributes(updated_at: self.created_at)
  end

end
