class Photo < ActiveRecord::Base

  belongs_to :imageable,   polymorphic: true
  has_many   :comments,    dependent: :destroy
  has_many   :likes,       dependent: :destroy
  has_many   :user_likes,  through: :likes, source: :user


  attr_accessible :bytes,
                  :format,
                  :height,
                  :public_id,
                  :resource_type,
                  :secure_url,
                  :signature,
                  :type,
                  :url,
                  :version,
                  :width,
                  :type

  #def liked?(user)
  #  !!likes.where(user_id: user.id).first
  #end
  #
  #def toggle_like(user)
  #   if like == likes.where(user_id: user).first
  #    like.destroy
  #  else
  #    likes << Like.new(user_id: user)
  #  end
  #end

end
