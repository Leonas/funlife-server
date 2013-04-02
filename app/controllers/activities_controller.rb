class ActivitiesController < ApplicationController
  before_filter :set_activity, only: [:show, :destroy, :update]
  # GET /activities
  # GET /activities.json
  # Current User's Activities
  def index
    @activities = @current_user.activities.page(params[:page]).by_pick_date(params[:date])
    render json: @activities, meta: pagination_attrs
  end

  # GET /feed
  # GET /feed.json
  def feed
    @activities = @current_user.feed_activities.page(params[:page]).by_pick_date(params[:date])
    render json: @activities, meta: pagination_attrs
  end

  # GET /activities/1
  # GET /activities/1.json
  def show
    render json: @activity
  end

  # POST /activities
  # POST /activities.json
  def create
    @activity = @current_user.activities.build(params[:activity])
    if @activity.save
      render json: @activity, status: :created
    else
      render json: @activity.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /activities/1
  # PATCH/PUT /activities/1.json
  def update
    if @activity.update_attributes(params[:activity])
      render json: @activity
    else
      render json: {errors: @activity.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /activities/1
  # DELETE /activities/1.json
  def destroy
    @activity.destroy
    head :no_content
  end

  private

  def pagination_attrs
    {
      total_records: @activities.total_count,
      total_pages:  @activities.num_pages,
      current_page:  @activities.current_page
    }
  end

  def set_activity
    @activity = @current_user.activities.find(params[:id])
  end
end
