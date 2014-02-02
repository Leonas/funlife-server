class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :avatar,
             :cover_photo,
             :following_count,
             :followers_count


  has_many :photos, each_serializer: PhotoSerializer
  has_many :comments, each_serializer: CommentSerializer, embed: :id
end
