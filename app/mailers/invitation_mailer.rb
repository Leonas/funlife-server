class InvitationMailer < ActionMailer::Base
  default from: "no-reply@funlife.com"

  def email(activity, guest)
    @activity = activity
    @user = activity.user
    @guest = guest
    mail(to: guest.email, subject: "You're invited #{@activity.headline}")
  end
end
