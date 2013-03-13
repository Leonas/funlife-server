class User < ActiveRecord::Base
  include ActiveModel::SecurePassword
  attr_accessible :email, :first_name, :full_name, :last_name
  attr_protected :token, :password_digest
  has_secure_password

  validates_presence_of :email
  validates_uniqueness_of :email
  before_save :ensure_authentication_token!

  def self.find_by_email(email)
    if User.where(email: email).exists?
      User.where(email: email).first
    else
      nil
    end
  end

  def self.find_by_token(token)
    if User.where(token: token).exists?
      User.where(token: token).first
    else
      nil
    end
  end

  def ensure_authentication_token!
    self.token ||= SecureRandom.urlsafe_base64
  end

  def reset_authentication_token!
    self.token = ''
  end


end
