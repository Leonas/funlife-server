class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :following_count,
             :followers_count

end
