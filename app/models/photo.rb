class Photo < ActiveRecord::Base
  # - Associations
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :user_likes, through: :likes, source: :user

  # - Mass Assignment Security
  attr_accessible :bytes, :format, :height, :public_id, :resource_type, :secure_url, :signature, :type, :url, :version, :width, :type, :processed_at

  def liked?(user)
    !!likes.where(user_id: user.id).first
  end
end

class ProfilePhoto < Photo
end
