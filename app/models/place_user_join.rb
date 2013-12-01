class PlaceUserJoin < ActiveRecord::Base

  #attr_accessible :place_id,
  #                :user_id
  #
  belongs_to :place
  belongs_to :user

end
