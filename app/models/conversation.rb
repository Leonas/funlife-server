class Conversation < ActiveRecord::Base

  has_many :conversation_user_joins,    dependent: :destroy
  has_many :conversation_messages,      dependent: :destroy, inverse_of: :conversation, order: "created_at DESC"
  has_many :users,                      through: :conversation_user_joins, order: "name ASC"

  accepts_nested_attributes_for :conversation_messages
  accepts_nested_attributes_for :conversation_user_joins


  validates_presence_of :conversation_messages
  validates :users, length: { minimum: 2 }


  def self.newest
    order("created_at DESC").limit(1).first
  end


end
