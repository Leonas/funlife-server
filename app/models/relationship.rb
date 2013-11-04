class Relationship < ActiveRecord::Base
  attr_accessible :followed_id     #the user's id who current_user is following

  belongs_to :follower, class_name: "User", counter_cache: :following_count
  belongs_to :followed, class_name: "User", counter_cache: :followers_count

  validates :follower_id, presence: true
  validates :followed_id, presence: true
  #validates_uniqueness_of :follower_id, :scope => :following_id

end