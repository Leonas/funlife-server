class LikesController < ApplicationController

  #post /photos/:id/like
  def like
    @photo = Photo.find(params[:id])
    if current_user.liked? @photo
      @photo.unliked_by current_user
      head :deleted
    else
      @photo.liked_by current_user
      head :created
    end

  end


end