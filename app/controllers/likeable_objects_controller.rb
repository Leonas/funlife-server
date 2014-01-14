class LikeableObjectsController < ApplicationController



  #post /objects/:id/likes
  def toggle_like
    @object = get_object
    if current_user.liked? @object
      @object.unliked_by current_user
      head :deleted
    else
      @object.liked_by current_user
      head :created
    end
  end



  def like
    @object = get_object
    @object.liked_by current_user
    head :created
  end



  def unlike
    @object = get_object
    if current_user.liked? @object
      @object.unliked_by current_user
      head :deleted
    end

  end


  private
  def get_object
    if params[:place_id]
      Place.find(params[:place_id])
    elsif params[:photo_id]
      Photo.find(params[:photo_id])
    end
  end


end