class EventsController < ApplicationController
  before_filter :set_activity, only: [:show, :destroy, :update]
  # GET /activities
  # GET /activities.json
  # Current User's Activities
  def index
    @events = @current_user.events.page(params[:page]).by_pick_date(params[:date])
    render json: @events, meta: pagination_attrs
  end

  # GET /feed
  # GET /feed.json
  def feed
    @events = @current_user.feed_activities.page(params[:page]).group(:date)
    render json: serialize_feed(@events).merge( {meta: pagination_attrs} )
  end

  # GET /activities/1
  # GET /activities/1.json
  def show
    render json: @event
  end

  # POST /activities
  # POST /activities.json
  def create
    @event = @current_user.events.build(params[:event])
    if @event.save
      render json: @event, status: :created
    else
      render json: @event.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /activities/1
  # PATCH/PUT /activities/1.json
  def update
    if @event.update_attributes(params[:event])
      render json: @event
    else
      render json: {errors: @event.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /activities/1
  # DELETE /activities/1.json
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

  def set_activity
    @event = @current_user.events.find(params[:id])
  end

  def serialize_feed(activities)
    activities.map do |activity|
      ActivitySerializer.new(activity, root: false).as_json
    end.group_by{|x| x[:date]}
  end
end
