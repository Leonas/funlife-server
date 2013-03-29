class PhotosController < ApplicationController
  before_filter :set_photo, only: [:destroy, :update]
  # GET /photos
  # GET /photos.json
  def index
    @photos = @current_user.photos
    render json: @photos
  end

  # GET /photos/1
  # GET /photos/1.json
  def show
    @photo = Photo.find(params[:id])
    render json: @photo
  end

  # POST /photos
  # POST /photos.json
  def create
    @photo = @current_user.photos.build(params[:photo])
    if @photo.save
      render json: @photo, status: :created
    else
      render json: @photo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /photos/1
  # DELETE /photos/1.json
  def destroy
    @photo.destroy
    head :no_content
  end

  private

  def set_photo
    @photo = @current_user.photos.find(params[:id])
  end
end
