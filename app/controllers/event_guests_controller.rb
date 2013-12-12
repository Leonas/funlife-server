class EventGuestsController < ApplicationController
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

  def create_guest
    @event = @current_user.events.find(params[:event_id])
    @event.guest_ids << params[:invitation][:user_ids]
    head :no_content
  end

  private

  def set_event
    @event = Event.find(params[:event_id])
  end

  def event_guest_params
    params.require(:event_guests).permit(
        :attending,
        :message
    )
  end
end
