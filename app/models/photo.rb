class Photo < ActiveRecord::Base

  belongs_to :imageable,   polymorphic: true
  has_many   :comments,    dependent: :destroy

  acts_as_votable


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
                  :file_type


  def date
    updated_at #needs to be in human format
  end

  def like_count
    likes.size
  end
end
