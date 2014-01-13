class UserLocation < ActiveRecord::Base

  belongs_to :user

  #sets user_id, date, longitude, latitude
end