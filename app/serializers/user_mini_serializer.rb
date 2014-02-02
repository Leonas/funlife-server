class UserMiniSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :avatar,
             :followed


end
