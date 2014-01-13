class Place < ActiveRecord::Base

  has_paper_trail
  acts_as_votable

  has_many   :photos,              as: :imageable
  has_many   :activity_place_joins
  has_many   :activities,          through: :activity_place_joins




  def favorited_by
    self.likes.by_type(User).voters
  end


end
