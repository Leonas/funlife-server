class ChatMessage < ActiveRecord::Base

  # - Mass Assignment Security
  attr_accessible :message, :user_id

  # Associations
  belongs_to :user
  belongs_to :chat

  # - Validations
  validates :message, presence: true
  validates :user, presence: true
  validates :chat, presence: true

  def self.since(timestamp = nil)
    cm = ChatMessage.arel_table
    timestamp ? where(cm[:created_at].gteq(timestamp)) : all
  end
end
