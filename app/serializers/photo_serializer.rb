class PhotoSerializer < ActiveModel::Serializer
  attributes :id,
             :url,
             :date,
             :like_count,
             :liked



  def liked
    @scope.current_user.liked? object
  end
end
