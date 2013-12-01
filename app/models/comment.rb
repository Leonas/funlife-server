class Comment < ActiveRecord::Base

  belongs_to :user
  belongs_to :commentable, polymorphic: true
  belongs_to :parent, class_name: 'Comment', counter_cache: :children_count
  has_many   :children, class_name: 'Comment', foreign_key: :parent_id, limit: 3, order: "created_at DESC"


  attr_accessible :body, :parent_id, :user_id


  validates :user, presence: true
  validates :body, presence: true
end
