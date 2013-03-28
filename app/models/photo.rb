class Photo < ActiveRecord::Base
  belongs_to :user
  attr_accessible :bytes, :format, :height, :public_id, :resource_type, :secure_url, :signature, :type, :url, :version, :width, :type
end

class ProfilePhoto < Photo
end
