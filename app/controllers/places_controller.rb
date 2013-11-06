class PlacesController < ApplicationController
  # GET /places
  def index
    @places = Place.all

    render json: @places
  end

  # GET /places/1
  def show
    @place = Place.find(params[:id])

    render json: @place
  end

  # POST /places
  def create
    @place = Place.new(params[:place])

    if @place.save
      render json: @place, status: :created, location: @place
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /places/1
  def update
    @place = Place.find(params[:id])

    if @place.update_attributes(params[:place])
      head :no_content
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  ## DELETE /places/1
  #def destroy
  #  @place = Place.find(params[:id])
  #  @place.destroy
  #
  #  head :no_content
  #end
end
