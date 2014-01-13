class PlacesController < ApplicationController


  #get /places
  def index
    @places = Place.all

    render json: @places
  end



  #get /places/1
  def show
    @place = Place.find(params[:id])

    render json: @place
  end


  #post /places/:id/like
  def like
    @place = Place.find(params[:id])
    if current_user.liked? @place
      @place.unliked_by current_user
      head :deleted
    else
      @place.liked_by current_user
      head :created
    end

  end



end
