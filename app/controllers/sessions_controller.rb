class SessionsController < ApplicationController
  skip_before_filter :authenticate_user_token, only: [:create]
  # POST /sessions
  # POST /sessions.json
  def create
    auth_params = params[:user] || {}
    @user = User.find_by_email(auth_params[:email])
    if @user && @user.authenticate(auth_params[:password])
      @current_user = @user
      render json: @user, serializer: CurrentUserSerializer, root: "user"
    else
      render json: @user, status: 401
    end
  end

  def destroy
    @current_user.reset_authentication_token!
    @current_user = nil
    head :no_content
  end
end
