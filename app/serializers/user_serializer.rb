class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :token

  def name
    object.full_name
  end

  # Include Authentication token if user already logged
  def include_token?
    !!scope.current_user
  end
end
