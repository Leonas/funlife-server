class ChatMessage < ActiveRecord::Base

  # - Mass Assignment Security
  attr_accessible :message, :user_id

  # Associations
  belongs_to :user
  belongs_to :chat

  # - Validations
  validate :message, presence: true
  validate :user, presence: true
  validate :chat, presence: true
end
