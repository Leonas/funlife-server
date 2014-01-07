class RelationshipsController < ApplicationController

  #post /relationships/:user_id
  def create
    @user = User.find(params[:user_id])

    if current_user.follow!(@user)
      head :created
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end

  end


  #delete /relationships/:user_id
  def destroy
    @user = User.find(params[:user_id])
    if current_user.unfollow!(@user)
      head :no_content
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end
  end

end