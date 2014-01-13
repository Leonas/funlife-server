class UserLocation < ActiveRecord::Base

  has_paper_trail

  belongs_to :user

  #sets user_id, date, longitude, latitude
end