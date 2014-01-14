class User < ActiveRecord::Base

  has_paper_trail

  has_secure_password #validations: false  #uncomment this for rails4
  acts_as_voter
  acts_as_tagger
  acts_as_taggable_on :favorite_activities


  #conversations

  # http://stackoverflow.com/questions/408872/rails-has-many-through-find-by-extra-attributes-in-join-model

  has_many :conversation_user_joins,    conditions: { hidden: false }    # in rails4 this has to be -> { where "hidden = false" }
  has_many :conversations,              through:   :conversation_user_joins, order: "updated_at DESC"
  has_many :conversation_messages,      order: "created_at DESC"

  #events
  has_many :guest_states,               class_name: "EventGuest", dependent: :destroy
  has_many :events,                     through: :guest_states, order: "created_at DESC"


  #relationships
  has_many :relationships,              foreign_key: "follower_id", dependent: :destroy
  has_many :followed_users,             through: :relationships, source: :followed, order: "name ASC"
  has_many :reverse_relationships,      foreign_key: "followed_id", class_name: "Relationship", dependent: :destroy
  has_many :followers,                  through: :reverse_relationships, source: :follower, order: "name ASC"


  #general
  has_many :photos,                     as: :imageable, dependent: :destroy, order: 'created_at DESC'
  has_many :comments,                   dependent: :destroy


  validates :email,           presence: true, uniqueness: true
  validates :gender,          inclusion: { in: ["male", "female"], allow_nil: true }
  validates :password, length: { minimum: 6 }, allow_nil: true

  before_validation { email.try { self.email = email.downcase} }
  before_validation :set_name!
  before_save :check_if_profile_complete
  before_create :ensure_authentication_token!

  ##################################################
  #  Definitions  ##################################
  ##################################################

  def check_if_profile_complete
    self.completed_profile = [
        self.email,
        self.first_name,
        self.last_name,
        self.name,
        self.gender,
        self.birthday,
        self.cover_photo_id,
        self.avatar_id
    ].all?
    true #to prevent .save returning false and causing a failing validation every time
  end

  def set_name!
    self.name = "#{first_name} #{last_name.chr}." if first_name and last_name
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
    self.avatar_id = photo.id
  end

  def set_cover_photo!(photo)
    self.cover_photo_id = photo.id
  end

  def delete_conversation(conversation_id)
    convo = conversation_user_joins.where(conversation_id: conversation_id).first
    convo.update_attributes(hidden: true)
  end

  def send_message_to_conversation(conversation, text)
    conversation_messages.create(conversation: conversation, text: text)
  end

  #def conversations
  # conversations.where(hidden: false)                #this needs to be a condition on the join model
  # # super
  #  #return array of non hidden conversations
  #  #http://api.rubyonrails.org/classes/ActiveRecord/Associations/ClassMethods.html
  #end

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

  def avatar
    if avatar_id
      photos.find(avatar_id)
    elsif gender == "male"
      "imagelinkblue"
    elsif gender == "female"
      "imagelinkpink"
    else
      "greyimage"
    end
  end

  def cover_photo
    photos.find(cover_photo_id) if cover_photo_id
  end

  def following_photos
    Photo.where(user_id: self.followed_users.select("following_id"))
  end

end
