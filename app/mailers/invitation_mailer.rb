class InvitationMailer < ActionMailer::Base
  default from: "no-reply@funlife.com"

  def email(event, guest)
    @event = event
    @user = event.user
    @guest = guest
    mail(to: guest.email, subject: "You're invited #{@event.headline}")
  end
end
