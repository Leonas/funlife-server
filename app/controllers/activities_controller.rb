class ActivitiesController < ApplicationController

  #get /activities
  def index
    @activities = Activity.all
    render json: @activities, each_serializer: ActivityIconsSerializer, root: "activities"
  end

  #get /activities/:id
  def show
    @activity = Activity.find(params[:id])
    render json: @activity, serializer: ActivitySerializer, root: "activity"
  end

  #get /activities/:id/events
  def events
    @activity = Activity.find(params[:id])
    render json: @activity.events, each_serializer: EventSerializer, root: "events"
  end

  #get /activities/:id/places
  def places
    @activity = Activity.find(params[:id])
    render json: @activity.places, each_serializer: PlaceSerializer, root: "places"
  end


end
