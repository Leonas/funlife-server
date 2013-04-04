class AttendeesController < ApplicationController
  def index
    @activity = Activity.find(params[:activity_id])
    @users = @activity.users
    render json: @users
  end
end
