class RelationshipsController < ApplicationController

  def create
    @user = User.find(params[:relationship][:followed_id])

    if current_user.follow!(@user)
      head :created
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end

  end




  def destroy
    @user = Relationship.find(params[:id]).followed

    if current_user.unfollow!(@user)
      head :no_content
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end
  end
end