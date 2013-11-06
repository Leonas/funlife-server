class Invitation < ActiveRecord::Base
  belongs_to :user
  belongs_to :event

  after_create :send_email

  def send_email
    InvitationMailer.email(self.event, self.user).deliver
  end
end
