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
  has_many :user_chats, dependent: :destroy
  has_many :chats, through: :user_chats
  has_many :chat_messages, dependent: :destroy

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


end
