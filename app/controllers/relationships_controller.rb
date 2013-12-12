class RelationshipsController < ApplicationController

  def create
    @user = User.find(params[:user_id])

    if current_user.follow!(@user)
      head :created
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end

  end

  def destroy
    @user = User.find(params[:user_id])
    if current_user.unfollow!(@user)
      head :no_content
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end
  end

end