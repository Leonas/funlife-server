class Invitation < ActiveRecord::Base
  belongs_to :user
  belongs_to :activity

  after_create :send_email

  def send_email
    InvitationMailer.email(self.activity, self.user).deliver
  end
end
