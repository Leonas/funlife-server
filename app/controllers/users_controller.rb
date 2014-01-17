class UsersController < ApplicationController
  skip_before_filter :authenticate_user_token, only: [:create, :options]


  #get /users
  def index
    @users = User.all :conditions => (current_user ? ["id != ?", current_user.id] : [])
    render json: @users, each_serializer: UsersNearbySerializer, root: "users"
  end



  #get /users/:id
  def show
    if @current_user.id.to_s == params[:id]
      render json: @current_user, serializer: UserSelfSerializer, root: "user"
    else
      @user = User.find(params[:id])
      render json: @user             #need to add thing for error
    end
  end



  #post /users
  def create
    @user = User.new(user_params)

    if @user.save
      @current_user = @user
      render json: @user, serializer: UserSelfSerializer, root: "user", status: :created
    else
      render json: {errors: @user.errors}, status: :unprocessable_entity
    end
  end



  #patch /users/:id
  def update
    if @current_user.update_attributes(user_params)
      head :no_content
    else
      render json: {errors: @current_user.errors}, status: :unprocessable_entity
    end
  end



  #get /users/:id/following
  def following
    @user = User.find(params[:id])
    @users = @user.followed_users      #.paginate(page: params[:page])
    if @users.empty?
      head :no_content
    else
      render json: @users, each_serializer: UsersFollowedSerializer
    end
  end



  #get /users/:id/followers
  def followers
    @user = User.find(params[:id])
    @users = @user.followers          #.paginate(page: params[:page])
    if @users.empty?
      head :no_content
    else
      render json: @users, each_serializer: UserFollowersSerializer
    end
  end



  #get /users/dashboard
  def dashboard
    render json: current_user, serializer: UserDashboardSerializer
  end



  #get /users/invitations
  def invitations
    @invitations = current_user.invitations
    if @invitations.empty?
      head :no_content
    else
      render json: @invitations, each_serializer: UserInvitationsSerializer
    end
  end


  #get /users/:id/fav_activities
  def fav_activities
    @user  = User.find(params[:id])
    @activities = @user.get_up_voted Activity
    if @activities.empty?
      head :no_content
    else
      render json: @activities, each_serializer: ActivityIconsSerializer
    end
  end


  #get /users/:id/fav_places
  def fav_places
    @user = User.find(params[:id])
    @places = @user.get_up_voted Place
    if @places.empty?
      head :no_content
    else
      render json: @places, each_serializer: PlaceMiniSerializer
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
