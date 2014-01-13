class ActivityPlaceJoin < ActiveRecord::Base

  has_paper_trail

  belongs_to :activity
  belongs_to :place

end
