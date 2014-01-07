class CommentSerializer < ActiveModel::Serializer
  attributes :id, :text, :user_name
  has_many :children

  def user_name
    object.user.full_name
  end
end
