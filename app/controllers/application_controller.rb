class ApplicationController < ActionController::API
  before_filter :set_access_control_headers
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



  def set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Request-Method'] = '*'
  end

end
