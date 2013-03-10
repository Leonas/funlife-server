class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  before_filter :cors_preflight_check, :myfix
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

 def myfix
   response.env['Access-Control-Allow-Origin'] = '*'
   request.env['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
   request.env['Access-Control-Max-Age'] = "1728000"
 end


# For all responses in this controller, return the CORS access control headers.

  def cors_set_access_control_headers

    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Max-Age'] = "1728000"
  end

# If this is a preflight OPTIONS request, then short-circuit the
# request, return only the necessary headers and return an empty
# text/plain.

  def cors_preflight_check
    if request.method == 'OPTIONS' || request.request_method == 'OPTIONS'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = '*'
      headers['Access-Control-Max-Age'] = '1728000'
      #head(:ok)
      render :text => '', :content_type => 'text/plain'
    end
  end

end
