class Comment < ActiveRecord::Base

  has_paper_trail

  belongs_to :user
  belongs_to :commentable, polymorphic: true
  belongs_to :parent,   class_name: 'Comment', counter_cache: :children_count
  has_many   :children, class_name: 'Comment', foreign_key: :parent_id, order: "created_at DESC"


  validates :user,  presence: true
  validates :text,  presence: true
  validates :depth, numericality: { less_than_or_equal_to: 2 }


  before_validation :set_depth!


  def set_depth!
    if parent
      if parent.depth < 2
        self.depth = parent.depth + 1
      else
        self.depth = 2
      end
    else
      self.depth = 0
    end
  end



end
