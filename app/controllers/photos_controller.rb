require 'digest/sha1'

class PhotosController < LikeableObjectsController


  #get /photos/auth
  #gets auth for cloudinary
  def auth
    @auth = Photo.cloudinary_auth
    @upload_auth = { upload_auth: @auth }
    render json: @upload_auth, status: :created
  end



  #get /photos/1
  def show
    @photo = Photo.find(params[:id])
    render json: @photo
  end



  #post /photos
  def create
    @photo = current_user.photos.build(photo_params)
    if @photo.save
      render json: @photo, status: :created
    else
      render json: @photo.errors, status: :unprocessable_entity
    end
  end



  #delete /photos/1
  def destroy
    @photo = current_user.photos.find(params[:id])
    @photo.destroy
    head :no_content
  end



  private

  def photo_params
    params.require(:photo).permit(
        :bytes,
        :format,
        :height,
        :width,
        :public_id,
        :url,
        :secure_url,
        :signature,
        :version
    )
  end

end
