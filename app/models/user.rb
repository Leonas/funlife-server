class User < ActiveRecord::Base
  has_secure_password #validations: false  #uncomment this for rails4
  acts_as_voter
  acts_as_tagger
  acts_as_taggable_on :favorite_activities

  GENDERS = ["male", "female"]

  #conversations
  has_many :conversation_user_joins
  has_many :conversations,              through:   :conversation_user_joins
  has_many :conversation_messages

  #events
  has_many :guest_states,               class_name: "EventGuest", dependent: :destroy
  has_many :events,                     through: :guest_states


  #relationships
  has_many :relationships,              foreign_key: "follower_id", dependent: :destroy
  has_many :followed_users,             through: :relationships, source: :followed
  has_many :reverse_relationships,      foreign_key: "followed_id", class_name: "Relationship", dependent: :destroy
  has_many :followers,                  through: :reverse_relationships, source: :follower


  #general
  has_many :photos,                     as: :imageable, dependent: :destroy, order: 'created_at DESC'
  has_many :comments,                   dependent: :destroy


  validates :email,           presence: true, uniqueness: true
  validates :gender,          inclusion: { in: GENDERS, allow_nil: true }

  validates :password, length: { minimum: 6 }, allow_nil: true
  before_save { self.email = email.downcase }
  #before_save { completed_profile? }
  before_create :ensure_authentication_token!

  ##################################################
  #  Definitions  ##################################
  ##################################################

  def completed_profile?
    self.completed_profile = [
        self.email,
        self.first_name,
        self.last_name,
        self.gender,
        self.birthday,
        self.main_photo_id,
        self.avatar_id
    ].all? { |attribute| attribute.blank?}

  end

  def name
    "new user"
    "#{first_name} #{last_name.chr}." if first_name and last_name
  end

  def full_name
    "#{first_name} #{last_name}"
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

  def set_avatar!(photo)
    #todo
  end

  def set_main_photo!(photo)
    #todo
  end

  ##################################################
  #  Queries  ######################################
  ##################################################

  def upcoming_events
    event = Event.arel_table

    # Includes the current_user's Events
    user_ids = self.followed_users.push(self.id)

    Event.where(
      event[:user_id].in(user_ids).or(
        event[:allow_join].eq(true)
      )
    )
  end

  def following_photos
    Photo.where(user_id: self.followed_users.select("following_id"))
  end

end
