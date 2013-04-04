class Attendee < ActiveRecord::Base
  belongs_to :user
  belongs_to :activity, counter_cache: true
  # attr_accessible :title, :body
  validates :activity_id, :uniqueness => { :scope => :user_id }
end
