require 'digest/sha1'

class PhotosController < ApplicationController
  before_filter :set_photo, only: [:destroy]


  # GET /photos/auth
  # used to get auth for cloudinary
  def auth
    @timestamp = Time.now.to_i
    @signature = Digest::SHA1.hexdigest("timestamp=#{@timestamp}#{CLOUDINARY.api_secret}")
    @auth = {
        unix_timestamp: @timestamp,
        api_key: CLOUDINARY.api_key,
        signature: @signature,
        upload_url: CLOUDINARY.upload_url
    }
    render json: @auth, serializer: PhotoAuthSerializer, root: "upload_auth"
  end



  # GET /photos/1
  def show
    @photo = Photo.find(params[:id])
    render json: @photo
  end



  #POST /photos/:id/like
  def like
    @photo = Photo.find(params[:id])
    @photo.toggle_like(current_user)
    head :okay
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



  private

  def set_photo
    @photo = @current_user.photos.find(params[:id])
  end
end
