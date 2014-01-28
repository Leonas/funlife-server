class UserSelfSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :token,
             :following_count,
             :followers_count
  #has_one :profile_photo, embed: :id


  ## Include Authentication token if user logged in
  #def include_token?
  #  !!scope.current_user
  #end
end
