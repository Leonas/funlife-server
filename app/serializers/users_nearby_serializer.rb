class UsersNearbySerializer < ActiveModel::Serializer
  attributes :id, :name

  def name
    object.full_name
  end

end
