class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :following_count, :followers_count
  #has_one :profile_photo, embed: :id


  #  #Include Authentication token if user already logged
  #  def include_token?
  #    !!scope.current_user
  #  end
end
