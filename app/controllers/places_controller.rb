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
    @place = Place.new(place_params)

    if @place.save
      render json: @place, status: :created, location: @place
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /places/1
  def update
    @place = Place.find(params[:id])

    if @place.update_attributes(place_params)
      head :no_content
    else
      render json: @place.errors, status: :unprocessable_entity
    end
  end

  ## DELETE /places/1                                  #sets place to hidden
  #def destroy
  #  @place = Place.find(params[:id])
  #  @place.destroy
  #
  #  head :no_content
  #end

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
