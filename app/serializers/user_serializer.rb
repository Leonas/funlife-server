class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :token, :following_count, :followers_count
  has_one :profile_photo, embed: :id

  def name
    object.full_name
  end

  # Include Authentication token if user already logged
  def include_token?
    !!scope.current_user
  end
end
