class User < ActiveRecord::Base
  include ActiveModel::SecurePassword
  has_secure_password

  GENDERS = %w(male female)

  attr_accessible :email, :first_name, :full_name, :last_name
  attr_protected :token, :password_digest

  validates :email, presence: true, uniqueness: true
  validates :gender, inclusion: { in: GENDERS, allow_nil: true }

  before_create :ensure_authentication_token!


  #activities
  has_many :activities
  has_many :invitations,         dependent: :destroy
  has_many :invited_activities,  through: :invitations, source: :activity
  has_many :attendees,           dependent: :destroy                     #why is this here?
  has_many :attended_activities, through: :attendees, source: :activity


  #conversations
  has_many :conversations,         through:   :conversation_users
  has_many :conversation_messages, through:   :conversations
  has_many :conversation_users,    dependent: :destroy


  #photos
  has_many :photos, dependent: :destroy
  has_one  :profile_photo


  #relationships
  has_many :friendships, dependent: :destroy, foreign_key: "follower_id", class_name: "Friendship"
  has_many :followings, through: :friendships
  has_many :my_followers, dependent: :destroy, foreign_key: "following_id", class_name: "Friendship"
  has_many :followers, through: :my_followers


  #general
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :photo_likes, through: :likes, source: :photo


  def ensure_authentication_token!
    self.token ||= SecureRandom.urlsafe_base64
  end

  def reset_authentication_token
    self.token = SecureRandom.urlsafe_base64
  end

  def reset_authentication_token!
    self.reset_authentication_token
    self.save
  end


  def full_name
    "#{first_name} #{last_name}"
  end


  # Query Methods

  # user.feed_activities
  # => "SELECT 'activities'.* FROM 'activities'  WHERE (('activities'.'user_id' IN (friends_ids, self.id) OR 'activities'.'allow_join' = 't'))"
  # TODO add attending activities
  def feed_activities
    activity = Activity.arel_table

    # Includes the current_user's Activities
    user_ids = self.following_ids.push(self.id)

    Activity.where(
      activity[:user_id].in(user_ids).or(
        activity[:allow_join].eq(true)
      )
    )
  end

  def following_photos
    # ActiveRecord::Relation
    Photo.where(user_id: self.followings.select("following_id"))
  end
end
