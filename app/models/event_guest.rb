class EventGuest < ActiveRecord::Base

  belongs_to :user
  belongs_to :event

  validates :event_id, uniqueness: { scope: :user_id }
  validates :guest_state, inclusion: { in: ["admin", "invited", "join_requested", "attending"], allow_nil: false }


  #after_create :send_email
  #
  #def send_email
  #  InvitationMailer.email(self.event, self.user).deliver
  #end
end
