class PhotosController < ApplicationController
  before_filter :set_photo, only: [:destroy, :update]


  # GET /photos
  def index
    @photos = @current_user.photos
    render json: @photos
  end

  # GET /photos/following
  def following
    @photos = @current_user.following_photos
    render json: @photos
  end

  # GET /photos/friends
  def explore
    @photos = Photo.all
    render json: @photos
  end

  # GET /photos/1
  def show
    @photo = Photo.find(params[:id])
    render json: @photo
  end

  # POST /photos
  def create
    @photo = @current_user.photos.build(params[:photo])
    if @photo.save
      render json: @photo, status: :created
    else
      render json: @photo.errors, status: :unprocessable_entity
    end
  end

  # DELETE /photos/1
  def destroy
    @photo.destroy
    head :no_content
  end

  def like
    @photo = Photo.find(params[:id])
    @photo.toogle_like(current_user)
    head :no_content
  end

  private

  def set_photo
    @photo = @current_user.photos.find(params[:id])
  end
end
