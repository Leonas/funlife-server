class CommentSerializer < ActiveModel::Serializer
  attributes :id,
             :parent_id,
             :children_count,
             :depth,
             :text

  has_one :user, serializer: UserMiniSerializer

end
