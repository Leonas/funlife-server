require 'shared_actions/likes'

class PlacesController < ApplicationController

  include Likes


  #get /places
  def index
    @places = Place.intelligent_sort(params[:longitude], params[:latitude])

    render json: @places, each_serializer: PlaceSerializer, root: "places"
  end



  #get /places/1
  def show
    @place = Place.find(params[:id])

    render json: @place, serializer: PlaceSerializer, root: "place"
  end


  ##post /places/:id/like
  #def like
  #  @place = Place.find(params[:id])
  #  if current_user.liked? @place
  #    @place.unliked_by current_user
  #    head :deleted
  #  else
  #    @place.liked_by current_user
  #    head :created
  #  end
  #
  #end



end
