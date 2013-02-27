class ApplicationController < ActionController::API

  private

  def current_user
    @current_user ||= User.find_by_token(params[:token]) if params[:token]
  end

  def authorize
    if current_user.nil?
      false
    else
      true
    end
  end

end
