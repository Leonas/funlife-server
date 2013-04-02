class ActivitySerializer < ActiveModel::Serializer
  embed :ids
  attributes :id, :headline, :details, :date, :start_time, :end_time, :allow_join, :maximum_users, :waitlist, :cost, :address
  has_one :user
end
