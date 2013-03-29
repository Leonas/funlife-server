class CommentSerializer < ActiveModel::Serializer
  attributes :id, :body, :user_name
  has_many :children

  def user_name
    object.user.full_name
  end
end
