class EventsController < ApplicationController

  #get /events
  def index

  end

  #get /events/1
  def show
    render json: @event
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
    if @event.update_attributes(event_params)
      render json: @event
    else
      render json: {errors: @event.errors}, status: :unprocessable_entity
    end
  end

  #delete /events/1
  def destroy
    @event.destroy
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
