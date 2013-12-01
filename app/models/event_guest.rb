class EventGuest < ActiveRecord::Base

  GUEST_STATES = ["admin", "invited", "join_requested", "attending"]

  attr_accessible :guest_state,
                  :attending,        #t/f
                  :message

  belongs_to :user
  belongs_to :event


  validates :event_id, uniqueness: { scope: :user_id }
  validates :guest_state, inclusion: { in: GUEST_STATES, allow_nil: false }


  #after_create :send_email
  #
  #def send_email
  #  InvitationMailer.email(self.event, self.user).deliver
  #end
end
