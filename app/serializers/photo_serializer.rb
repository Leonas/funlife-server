class PhotoSerializer < ActiveModel::Serializer
  attributes :id,
             :url,
             :date,
             :like_count,
             :liked


  def date
    object.updated_at.strftime("%b %d,  %I:%M%P")
  end

  def liked
    @scope.current_user.liked? object
  end
end
