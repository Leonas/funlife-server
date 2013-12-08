class Photo < ActiveRecord::Base

  belongs_to :imageable,   polymorphic: true
  has_many   :comments,    as: :commentable, dependent: :destroy

  acts_as_votable

  def self.cloudinary_auth
    @timestamp = Time.now.to_i
    @cloudinary = CLOUDINARY[Rails.env.to_sym]
    @signature = Digest::SHA1.hexdigest("timestamp=#{@timestamp}#{@cloudinary['api_secret']}")
    @auth = {
        timestamp: @timestamp,
        api_key: @cloudinary['api_key'],
        signature: @signature,
        upload_url: @cloudinary['upload_url']
    }
  end

  def date
    updated_at #needs to be in human format
  end

  def like_count
    likes.size
  end
end
