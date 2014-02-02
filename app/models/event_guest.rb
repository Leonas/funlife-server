class EventGuest < ActiveRecord::Base

  has_paper_trail

  belongs_to :user
  belongs_to :event

  validates :event_id, uniqueness: { scope: :user_id }
  validates :guest_state, inclusion: { in: ["admin", "invited", "join_requested", "attending", "not_attending"], allow_nil: false }


  #after_create :send_email
  #
  #def send_email
  #  InvitationMailer.email(self.event, self.user).deliver
  #end
end
