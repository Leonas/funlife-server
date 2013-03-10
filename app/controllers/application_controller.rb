class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  before_filter :cors_preflight_check
  after_filter :cors_set_access_control_headers
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


# For all responses in this controller, return the CORS access control headers.

  def cors_set_access_control_headers

    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*'
  end

# If this is a preflight OPTIONS request, then short-circuit the
# request, return only the necessary headers and return an empty
# text/plain.

  def cors_preflight_check
    if request.method == 'OPTIONS' || request.request_method == 'OPTIONS'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = '*'
      #head(:ok)
      render :text => '', :content_type => 'text/plain'
    end
  end

end
