class PhotoSerializer < ActiveModel::Serializer
  attributes :id, :public_id, :version, :signature, :width, :height, :format, :resource_type, :bytes, :type, :url, :secure_url, :type
  has_one :user, embed: :id
end
