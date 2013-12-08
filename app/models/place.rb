class Place < ActiveRecord::Base
  belongs_to :location,            polymorphic: true
  has_many   :photos,              as: :imageable
  has_many   :activity_place_joins
  has_many   :activities,          through: :activity_place_joins

  acts_as_votable



  def whats_here?
    #shows the tags of the place: biking, bike rentals, etc
  end

end
