class EventGuestsController < ApplicationController

  #get /events/:id/guests
  def index
    @event = Event.find(params[:event_id])
    @guests = @event.users
    render json: @guests
  end

  #get /events/:id/guests/attending
  def attending
    @event = Event.find(params[:event_id])
    @attending = @event.guests.where(attending: true)
    render json: @attending
  end

  #patch /events/:id/guests
  def update
    @event = Event.find(params[:event_id])
    @event = @current_user.events.find(params[:event_id])
    @event.guest_ids << params[:invitation][:user_ids]

    if @event_guests.save
      render json: @attendee, status: :created
    else
      render json: { errors: @attendee.errors }, status: :unprocessable_entity
    end

  end

  private

  def event_guest_params
    params.require(:event_guests).permit(
        :attending,
        :message
    )
  end
end
