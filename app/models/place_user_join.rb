class PlaceUserJoin < ActiveRecord::Base
  belongs_to :place
  belongs_to :user

  attr_accessible :place_id, :user_id
end
