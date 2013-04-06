class PhotoSerializer < ActiveModel::Serializer
  attributes :id, :public_id, :version, :signature, :width, :height, :format,
    :resource_type, :bytes, :type, :url, :secure_url, :type, :processed_at, :likes_count, :liked
  has_one :user, embed: :id

  def liked
    object.liked?(scope.current_user)
  end
end
