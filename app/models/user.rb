class User < ActiveRecord::Base
  include ActiveModel::SecurePassword
  has_secure_password

  # - Mass Assignment Security
  attr_accessible :email, :first_name, :full_name, :last_name

  attr_protected :token, :password_digest

  # - Validations
  validates :email, presence: true, uniqueness: true

  # - Callbacks
  before_create :ensure_authentication_token!

  # Associations
  has_many :activities
  has_many :user_chats, dependent: :destroy
  has_many :chats, through: :user_chats
  has_many :chat_messages, dependent: :destroy
  has_many :photos, dependent: :destroy
  has_one  :profile_photo

  has_many :friendships, dependent: :destroy, foreign_key: "follower_id", class_name: "Friendship"
  has_many :friends, through: :friendships

  has_many :my_followers, dependent: :destroy, foreign_key: "friend_id", class_name: "Friendship"
  has_many :followers, through: :my_followers

  has_many :comments, dependent: :destroy

  def ensure_authentication_token!
    self.token ||= SecureRandom.urlsafe_base64(15)
  end

  def reset_authentication_token
    self.token = SecureRandom.urlsafe_base64(15)
  end

  def reset_authentication_token!
    self.reset_authentication_token
    self.save
  end


  # Query Methods

  # user.feed_activities
  # => "SELECT 'activities'.* FROM 'activities'  WHERE (('activities'.'user_id' IN (friends_ids, self.id) OR 'activities'.'allow_join' = 't'))"
  # TODO add attending activities
  def feed_activities
    act = Activity.arel_table

    # Includes the current_user's Activities
    user_ids = self.friend_ids.push(self.id)

    Activity.where(
      act[:user_id].in(user_ids).or(
        act[:allow_join].eq(true)
      )
    )
  end

  def friend_photos
    # ActiveRecord::Relation
    Photo.where(user_id: self.friends.select("friend_id"))
  end
end
