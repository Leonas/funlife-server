class Event < ActiveRecord::Base



  attr_accessible :name,
                  :details,
                  :date,
                  :time,
                  :duration,
                  :max_attendance,
                  :invite_only?,
                  :allow_request_invite?,
                  :allow_women?,
                  :allow_men?,
                  :allow_youngest_age,
                  :allow_oldest_age,
                  :attendees_count


  belongs_to :user
  #has_many :activities                                 # this and migrations need fixing
  #has_many :categories, through: :activities           # this and migrations need fixing

  has_many :invitations,    dependent: :destroy
  has_many :guests,         through: :invitations, source: :user         #wtf is diff between this and attendees?

  has_many :attendees,      dependent: :destroy
  has_many :users,          through: :attendees

  has_one  :place,          as: :location




end
