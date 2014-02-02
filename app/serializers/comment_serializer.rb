class CommentSerializer < ActiveModel::Serializer
  attributes :id,
             :parent_id,
             :children,
             :depth,
             :text,
             :date

  has_one :user, serializer: UserMiniSerializer


  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end

  def children
    object.children_count
  end
end
