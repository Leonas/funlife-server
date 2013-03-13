class ChatMessage < ActiveRecord::Base

  attr_accessible :message

  belongs_to :user
  belongs_to :chat
end
