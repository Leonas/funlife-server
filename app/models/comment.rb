class Comment < ActiveRecord::Base

  has_paper_trail

  belongs_to :user
  belongs_to :commentable, polymorphic: true
  belongs_to :parent, class_name: 'Comment', counter_cache: :children_count
  has_many   :children, class_name: 'Comment', foreign_key: :parent_id, limit: 3, order: "created_at DESC"


  validates :user, presence: true
  validates :text, presence: true
end
