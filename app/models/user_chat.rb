class UserChat < ActiveRecord::Base
  # Associations
  belongs_to :chat
  belongs_to :user

  # Validations
  validates_uniqueness_of :chat_id, :scope => :user_id
end
