class EventsController < ApplicationController

  #get /events
  def index
    @events = Event.public
    render json: @events, each_serializer: EventSerializer, root: "events"
  end

  #get /events/1
  def show
    @event = Event.find(params[:id])
    render json: @event, serializer: EventSerializer, root: "event"
  end

  #post /events
  def create
    @event = @current_user.events.build(event_params)
    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  #patch /events/1
  def update
    @event = current_user.events.where(:id, params[:id])

    if @event.update_attributes(event_params)                             #TODO check if event admin first
      render json: @event
    else
      render json: {errors: @event.errors}, status: :unprocessable_entity
    end
  end

  #delete /events/1
  def destroy
    @event = current_user.events.where(:id, params[:id])
    @event.destroy                                          #TODO check if event admin first
    head :no_content
  end

  private

  def event_params
    params.require(:event).permit(
        :title,
        :details,
        :date,
        :start_time,
        :end_time,
        :duration,
        :visibility,
        :min_age,
        :max_age
    )
  end
end
