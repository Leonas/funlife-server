class User < ActiveRecord::Base
  include ActiveModel::SecurePassword
  has_secure_password

  GENDERS = %w(male female)

  attr_accessible :email, :first_name, :last_name, :full_name, :name
  attr_protected :token, :password_digest

  validates :email, presence: true, uniqueness: true
  validates :gender, inclusion: { in: GENDERS, allow_nil: true }

  before_create :ensure_authentication_token!

  #conversations
  has_many :conversations,         through:   :conversation_users
  has_many :conversation_messages
  has_many :conversation_users,    dependent: :destroy

  #activities
  has_many :events
  has_many :invitations,         dependent: :destroy
  has_many :invited_activities,  through: :invitations, source: :activity
  has_many :attendees,           dependent: :destroy                     #why is this here?
  has_many :attended_activities, through: :attendees,   source: :activity

  #photos
  has_many :photos, dependent: :destroy
  has_one  :profile_photo


  #relationships
  has_many :relationships, foreign_key: "follower_id", dependent: :destroy
  has_many :followed_users, through: :relationships, source: :followed
  has_many :reverse_relationships, foreign_key: "followed_id", class_name: "Relationship", dependent: :destroy
  has_many :followers, through: :reverse_relationships, source: :follower

  #general
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :photo_likes, through: :likes, source: :photo



  ##################################################
  #  Definitions  ##################################
  ##################################################

  def full_name
    "#{first_name} #{last_name}"
  end

  def name
    "new user"
    "#{first_name} #{last_name.chr}." if first_name and last_name
  end

  ##################################################
  #  Actions  ######################################
  ##################################################

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

  def following?(other_user)
    relationships.find_by_followed_id(other_user.id)
  end

  def follow!(other_user)
    relationships.create!(followed_id: other_user.id)
  end

  def unfollow!(other_user)
    relationships.find_by_followed_id(other_user.id).destroy
  end


  ##################################################
  #  Queries  ######################################
  ##################################################

  def feed_activities
    activity = Event.arel_table

    # Includes the current_user's Activities
    user_ids = self.following_ids.push(self.id)

    Event.where(
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
