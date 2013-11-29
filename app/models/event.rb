class Event < ActiveRecord::Base



  attr_accessible :title,
                  :details,
                  :date,
                  :start_time,
                  :end_time,
                  :duration,
                  :private?,
                  :visible_to_women?,
                  :visible_to_men?,
                  :youngest_allowed_age,
                  :oldest_allowed_age,
                  :attendees_count,
                  :activated?



  #has_many :activities                                 # this and migrations need fixing
  #has_many :categories, through: :activities           # this and migrations need fixing

  has_many :invitations,    dependent: :destroy
  has_many :guests,         through: :invitations, source: :user         #wtf is diff between this and attendees?

  has_many :attendees,      dependent: :destroy
  has_many :users,          through: :attendees

  has_one  :place,          as: :location


  def activate!
    #if all items filled out, then set to active
  end

end
