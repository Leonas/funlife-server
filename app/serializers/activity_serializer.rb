class ActivitySerializer < ActiveModel::Serializer
  attributes :id, :headline, :details, :date, :start_time, :end_time, :allow_join, :maximum_users, :waitlist, :cost, :address
  has_one :user, embed: :ids
  has_many :categories, embed: :objects
end
