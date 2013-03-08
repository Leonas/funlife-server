class ApplicationController < ActionController::API

  private

  def current_user
    @current_user ||= User.find_by_token(request.env['HTTP_TOKEN']) if request.env['HTTP_TOKEN']
  end

  def authorize
    if current_user.nil?
      head :not_found
    else
      true
    end
  end

end
