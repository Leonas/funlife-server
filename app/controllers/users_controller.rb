class UsersController < ApplicationController
  skip_before_filter :authenticate_user_token, only: [:create, :options]


  # GET /users
  def index
    @users = User.all :conditions => (current_user ? ["id != ?", current_user.id] : [])
    render json: @users, each_serializer: UsersNearbySerializer, root: "users"
  end



  # GET /users/:id
  def show
    if @current_user.id.to_s == params[:id]
      render json: @current_user, serializer: UserSelfSerializer, root: "user"
    else
      @user = User.find(params[:id])
      render json: @user             #need to add thing for error
    end
  end



  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      @current_user = @user
      render json: @user, serializer: UserSelfSerializer, root: "user", status: :created
    else
      render json: {errors: @user.errors}, status: :unprocessable_entity
    end
  end



  # PATCH /users/:id
  def update
    if @current_user.update_attributes(user_params)
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

  def user_params
    params.require(:user).permit(
        :email,
        :password,
        :first_name,
        :last_name,
        :gender,
        :birthday
    )

  end
end
