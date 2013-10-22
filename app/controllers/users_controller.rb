class UsersController < ApplicationController
  before_filter :set_user, only: [:show, :edit, :destroy]
  skip_before_filter :authenticate_user_token, only: [:create, :options]

  # GET /users
  def index
    @users = User.all :conditions => (current_user ? ["id != ?", current_user.id] : [])
    render json: @users, each_serializer: NearbyUsersSerializer, root: "users"
  end

  # GET /users/:id
  def show
    if @current_user.id.to_s == params[:id]
      render json: @user, serializer: CurrentUserSerializer, root: "user"
    else
      render json: @user
    end

  end


  # POST /users
  def create
    @user = User.new(params[:user])

    if @user.save
      @current_user = @user
      render json: @user, status: :created, serializer: CurrentUserSerializer, root: "user"
    else
      render json: {errors: @user.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/:id
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
