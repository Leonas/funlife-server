class Conversation < ActiveRecord::Base

  has_many :conversation_user_joins,    dependent: :destroy
  has_many :conversation_messages,      dependent: :destroy, order: "created_at DESC"
  has_many :users,                      through: :conversation_user_joins, order: "name ASC"

  accepts_nested_attributes_for :conversation_messages
  accepts_nested_attributes_for :conversation_user_joins


  validates_presence_of :conversation_messages
  validates :users, length: { minimum: 2 }

  def latest_message
     conversation_messages.limit(1)
  end

end
