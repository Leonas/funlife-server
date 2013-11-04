class AttendeesController < ApplicationController
  before_filter :set_event

  def index
    @users = @event.users
    render json: @users
  end

  def create
    @attendee = @event.attendees.build(user_id: @current_user)

    if @attendee.save
      render json: @attendee, status: :created
    else
      render json: {errors: @attendee.errors}, status: :unprocessable_entity
    end
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end
end
