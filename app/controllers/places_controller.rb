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

  #post /places
  def create
    @place = Place.new(place_params)

    if @place.save
      render json: @place, status: :created, location: @place
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  #patch /places/1
  def update
    @place = Place.find(params[:id])

    if @place.update_attributes(place_params)
      head :no_content
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  #delete /places/1
  def destroy
    @place = Place.find(params[:id])

    if @place.hide
      head :no_content
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

 private

  def place_params
    params.require(:place).permit(
        :name,
        :street_address,
        :zip_code,
        :city,
        :longitude,
        :latitude,
        :time_open,
        :time_close,
        :phone,
        :summary,
        :description,
        :featured
    )
  end

end
