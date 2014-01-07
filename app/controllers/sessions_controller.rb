class SessionsController < ApplicationController
  skip_before_filter :authenticate_user_token, only: [:create]


  #post /sessions
  def create
    auth_params = params[:user] || {}
    @user = User.find_by_email(auth_params[:email])
    if @user && @user.authenticate(auth_params[:password])
      @current_user = @user
      render json: @user, serializer: UserSelfSerializer, root: "user"
    else
      render json: @user, status: 401
    end
  end

  #delete /sessions
  def destroy
    @current_user.reset_authentication_token!
    @current_user = nil
    head :no_content
  end
end
