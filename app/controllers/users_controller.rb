class UsersController < ApplicationController
  before_filter :set_user, only: [:show, :edit, :destroy]
  skip_before_filter :authenticate_user_token, only: [:create, :options]


  # GET /users
  def index
    @users = User.all :conditions => (current_user ? ["id != ?", current_user.id] : [])
    render json: @users, each_serializer: UsersNearbySerializer, root: "users"
  end


  # GET /users/:id
  def show
    if @current_user.id.to_s == params[:id]
      render json: @user, serializer: UserSelfSerializer, root: "user"
    else
      render json: @user
    end

  end


  # POST /users
  def create
    @user = User.new(params[:user])

    if @user.save
      @current_user = @user
      render json: @user, serializer: UserSelfSerializer, root: "user", status: :created
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


  # GET /users/:id/following
  def following
    @user = User.find(params[:id])
    @users = @user.followed_users      #.paginate(page: params[:page])
    if @users.empty?
      head :no_content
    else
      render json: @users, each_serializer: UsersFollowedSerializer
    end
  end


  # GET /users/:id/followers
  def followers
    @user = User.find(params[:id])
    @users = @user.followers          #.paginate(page: params[:page])
    if @users.empty?
      head :no_content
    else
      render json: @users, each_serializer: UserFollowersSerializer
    end
  end

  def options
    cors_preflight_check
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
