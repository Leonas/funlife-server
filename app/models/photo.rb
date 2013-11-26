class Photo < ActiveRecord::Base

  belongs_to :imageable,   polymorphic: true
  has_many   :comments,    dependent: :destroy
  has_many   :likes,       dependent: :destroy


  attr_accessible :bytes,
                  :format,
                  :height,
                  :public_id,
                  :resource_type,
                  :secure_url,
                  :signature,
                  :url,
                  :version,
                  :width,
                  :type


end
