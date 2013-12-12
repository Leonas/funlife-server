class EventsController < ApplicationController

  # GET /events
  def index

  end

  # GET /events/1
  def show
    render json: @event
  end

  # POST /events
  def create
    @event = @current_user.events.build(event_params)
    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/1
  def update
    if @event.update_attributes(event_params)
      render json: @event
    else
      render json: {errors: @event.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /events/1
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
