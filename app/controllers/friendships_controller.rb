class FriendshipsController < ApplicationController
  # POST /friendships
  def create
    @friendship = @current_user.friendships.build(friend_id: params[:friend_id])
    if @friendship.save
      render json: @friendship, status: :created, location: @friendship
    else
      render json: {errors: @friendship.errors}, status: :unprocessable_entity
    end
  end

  def destroy
    @friendship = @current_user.friendships.find(params[:id])
    @friendship.destroy
    head :no_content
  end

end
