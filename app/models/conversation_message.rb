class ConversationMessage < ActiveRecord::Base

  # - Mass Assignment Security
  attr_accessible :message, :user_id

  # Associations
  belongs_to :user
  belongs_to :conversation

  # - Validations
  validates :message, presence: true
  validates :user, presence: true
  validates :conversation, presence: true

  def self.since(timestamp = nil)
    cm = ConversationMessage.arel_table
    timestamp ? where(cm[:created_at].gteq(timestamp)) : all
  end
end
