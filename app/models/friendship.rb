class Friendship < ActiveRecord::Base
  attr_accessible :follower_id, :friend_id

  # - Validations
  validates_uniqueness_of :follower_id, :scope => :friend_id

  # - Associations
  belongs_to :follower, class_name: "User", foreign_key: "follower_id", counter_cache: :friends_count
  belongs_to :friend, class_name: "User", foreign_key: "friend_id", counter_cache: :followers_count
end
