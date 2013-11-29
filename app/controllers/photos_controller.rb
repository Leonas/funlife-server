require 'digest/sha1'

class PhotosController < ApplicationController
  before_filter :set_photo, only: [:destroy]


  # GET /photos/auth
  # used to get auth for cloudinary
  def auth
    @auth = Photo.cloudinary_auth
    @upload_auth = { upload_auth: @auth }
    render json: @upload_auth, status: :created
  end



  # GET /photos/1
  def show
    @photo = Photo.find(params[:id])
    render json: @photo
  end



  #POST /photos/:id/like
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



  # POST /photos
  def create
    @photo = current_user.photos.build(params[:photo])
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



  private

  def set_photo
    @photo = current_user.photos.find(params[:id])
  end
end
