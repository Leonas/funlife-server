class User < ActiveRecord::Base
  include ActiveModel::SecurePassword
  has_secure_password

  # - Mass Assignment Security
  attr_accessible :email, :first_name, :full_name, :last_name

  attr_protected :token, :password_digest

  # - Validations
  validates :email, presence: true, uniqueness: true

  # - Callbacks
  before_save :ensure_authentication_token!

  def ensure_authentication_token!
    self.token ||= SecureRandom.urlsafe_base64(15)
  end

  def reset_authentication_token!
    self.token = ''
  end


end
