class AttendeesController < ApplicationController
  before_filter :set_activity

  def index
    @users = @activity.users
    render json: @users
  end

  def create
    @attendee = @activity.attendees.build(user_id: @current_user)

    if @attendee.save
      render json: @attendee, status: :created
    else
      render json: {errors: @attendee.errors}, status: :unprocessable_entity
    end
  end

  private

  def set_activity
    @activity = Activity.find(params[:activity_id])
  end
end
