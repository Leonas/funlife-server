class Invitation < ActiveRecord::Base
  belongs_to :user
  belongs_to :activity
  # attr_accessible :title, :body
end
