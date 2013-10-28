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
    conversation_messages = ConversationMessage.arel_table
    #for more info on arel, look here:
    #http://www.slideshare.net/brynary/arel-ruby-relational-algebra
    #http://www.slideshare.net/flah00/activerecord-arel
    if timestamp
      where(conversation_messages[:created_at].gteq(timestamp))
    else
      all
    end
  end
end
