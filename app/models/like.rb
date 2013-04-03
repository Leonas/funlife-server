class Like < ActiveRecord::Base
  # Associations

  # Change to Polymorphic Associations, if appears more models to like
  belongs_to :user, counter_cache: true
  belongs_to :photo, counter_cache: true

  # Validations
  validates_uniqueness_of :chat_id, scope: :user_id
end
