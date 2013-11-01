class ConversationMessage < ActiveRecord::Base

  attr_accessible :message
  attr_accessible :user_id

  belongs_to :user
  belongs_to :conversation

  validates_presence_of :message
  validates_presence_of :user
  validates_presence_of :conversation

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
