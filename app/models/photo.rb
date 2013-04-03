class Photo < ActiveRecord::Base
  # - Associations
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :user_likes, through: :likes, source: :user

  # - Mass Assignment Security
  attr_accessible :bytes, :format, :height, :public_id, :resource_type, :secure_url, :signature, :type, :url, :version, :width, :type, :processed_at
end

class ProfilePhoto < Photo
end
