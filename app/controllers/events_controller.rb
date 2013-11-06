class EventsController < ApplicationController
  before_filter :set_event, only: [:show, :destroy, :update]
  # GET /events
  # GET /events.json
  # Current User's Events
  def index
    @events = @current_user.events.page(params[:page]).by_pick_date(params[:date])
    render json: @events, meta: pagination_attrs
  end

  # GET /feed
  # GET /feed.json
  def feed
    @events = @current_user.feed_events.page(params[:page]).group(:date)
    render json: serialize_feed(@events).merge( {meta: pagination_attrs} )
  end

  # GET /events/1
  # GET /events/1.json
  def show
    render json: @event
  end

  # POST /events
  # POST /events.json
  def create
    @event = @current_user.events.build(params[:event])
    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /events/1
  # PATCH/PUT /events/1.json
  def update
    if @event.update_attributes(params[:event])
      render json: @event
    else
      render json: {errors: @event.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /events/1
  # DELETE /events/1.json
  def destroy
    @event.destroy
    head :no_content
  end

  private

  def pagination_attrs
    {
      total_records: @events.total_count,
      total_pages:  @events.num_pages,
      current_page:  @events.current_page
    }
  end

  def set_event
    @event = @current_user.events.find(params[:id])
  end

  def serialize_feed(events)
    events.map do |event|
      EventSerializer.new(event, root: false).as_json
    end.group_by{|x| x[:date]}
  end
end
