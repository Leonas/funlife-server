module Likes


  #post /objects/:id/likes
  def toggle_like
    
    set_likeable_object
    if current_user.liked? @likeable_object
      @likeable_object.unliked_by current_user
      head :deleted
    else
      @likeable_object.liked_by current_user
      head :created
    end
  end


  def like
    set_likeable_object
    @likeable_object.liked_by current_user
    head :created
  end


  def unlike
    set_likeable_object
    if current_user.liked? @likeable_object
      @likeable_object.unliked_by current_user
      head :deleted
    end

  end


  private
  def set_likeable_object
    current_model = controller_name.classify.constantize
    @likeable_object = current_model.find(params[:id])
  end

end