class ApplicationController < ActionController::Base
  include ActionController::MimeResponds

  around_filter :global_request_logging

  before_filter :authenticate_user_token
  before_filter :cors_preflight_check
  before_filter :allow_cross_domain



  attr_reader :current_user

  serialization_scope :controller

  def controller
    self
  end

  protected

  def authenticate_user_token
    authenticate_or_request_with_http_basic do |authentication_token, _|
      @current_user = User.find_by_token(authentication_token)
    end
  end



  private

  def allow_cross_domain
    headers["Access-Control-Allow-Origin"] = '*'
    headers["Access-Control-Request-Method"] = "*"
    headers["Access-Control-Allow-Methods"] = "PUT, OPTIONS, GET, DELETE, POST"
    headers['Access-Control-Allow-Headers'] = '*, x-requested-with, Content-Type, Authorization'
    headers["Access-Control-Max-Age"] = '1728000'
  end
  #
  def options
    cors_preflight_check
  end

# For all responses in this controller, return the CORS access control headers.
#
#  def cors_set_access_control_headers
#
#    headers['Access-Control-Allow-Origin'] = '*'
#    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
#    headers['Access-Control-Allow-Headers'] = '*'
#  end
#
## If this is a preflight OPTIONS request, then short-circuit the
## request, return only the necessary headers and return an empty
## text/plain.

  def cors_preflight_check
    if request.method == 'OPTIONS' || request.request_method == 'OPTIONS'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = '*, x-requested-with, Content-Type, Authorization'
      headers["Access-Control-Max-Age"] = '1728000'
      #head(:ok)
      render :text => '', :content_type => 'text/plain'
    end
  end

  def global_request_logging

    http_request_header_keys = request.headers.keys.select{|header_name| header_name.match("^HTTP.*")}
    http_request_headers = request.headers.select{|header_name, header_value| http_request_header_keys.index(header_name)}
    logger.info "Received #{request.method.inspect} to #{request.url.inspect} from #{request.remote_ip.inspect}.  Processing with headers #{http_request_headers.inspect} and params #{params.inspect}"
    begin
      yield
    ensure
      logger.info "Responding with #{response.status.inspect} => #{response.body.inspect}"
    end
  end

end
