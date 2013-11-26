class Like < ActiveRecord::Base

  belongs_to :likeable, polymorphic: true, counter_cache: true
  belongs_to :user,                        counter_cache: true


  attr_accessible :likeable_id,
                  :likeable_type,
                  :user_id

   after_create :add_like_to_obj
end
