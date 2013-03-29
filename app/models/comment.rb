class Comment < ActiveRecord::Base
  # - Associations
  belongs_to :user
  belongs_to :photo, counter_cache: true
  belongs_to :parent, class_name: 'Comment', counter_cache: :children_count
  has_many :children, class_name: 'Comment', foreign_key: :parent_id

  # - Mass Assignment Security
  attr_accessible :body, :parent_id, :user_id

  # - Validations
  validates :user, presence: true
  validates :photo, presence: true
  validates :body, presence: true
end
