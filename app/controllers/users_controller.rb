class UsersController < ApplicationController
  before_filter :set_user, only: [:show, :edit, :destroy]
  skip_before_filter :authenticate_user_token, only: [:create, :options]

  # GET /users
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1
  # GET /users/1.json
  def show
    render json: @user
  end


  # POST /users
  # POST /users.json
  def create
    @user = User.new(params[:user])

    if @user.save
      @current_user = @user
      render json: @user, status: :created, location: @user
    else
      render json: {errors: @user.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    if @current_user.update_attributes(params[:user])
      head :no_content
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end
  end

  def options
    cors_preflight_check
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end
end
