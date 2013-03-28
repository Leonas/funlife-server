class PhotoSerializer < ActiveModel::Serializer
  attributes :id, :public_id, :version, :signature, :width, :height, :format, :resource_type, :bytes, :type, :url, :secure_url
  has_one :user
end
