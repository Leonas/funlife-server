class Photo < ActiveRecord::Base
  # - Associations
  belongs_to :user
  has_many :comments, dependent: :destroy

  # - Mass Assignment Security
  attr_accessible :bytes, :format, :height, :public_id, :resource_type, :secure_url, :signature, :type, :url, :version, :width, :type
end

class ProfilePhoto < Photo
end
