class Relationship < ActiveRecord::Base
  attr_accessible :follower_id, :following_id

  # - Validations
  validates_uniqueness_of :follower_id, :scope => :following_id

  # - Associations
  belongs_to :follower, class_name: "User", foreign_key: "follower_id", counter_cache: :following_count
  belongs_to :following, class_name: "User", foreign_key: "following_id", counter_cache: :followers_count

  attr_accessible :followed_id

  belongs_to :follower, class_name: "User"
  belongs_to :followed, class_name: "User"

  validates :follower_id, presence: true
  validates :followed_id, presence: true
end
