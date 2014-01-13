class Place < ActiveRecord::Base
  has_many   :photos,              as: :imageable
  has_many   :activity_place_joins
  has_many   :activities,          through: :activity_place_joins

  acts_as_votable


  def favorited_by
    #users who favorited this
  end


end
