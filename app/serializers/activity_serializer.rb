class ActivitySerializer < ActiveModel::Serializer
  embed :ids
  attributes :id, :headline, :details, :pick_time, :start_time, :end_time, :allow_join, :maximum_users, :waitlist, :cost
  has_one :user
end
