Each serializer is essentially a view of pure JSON

Read https://github.com/rails-api/active_model_serializers for more info

Railscast: http://railscasts.com/episodes/409-active-model-serializers



In a serializer, current_user is the current authorization scope which the controller provides to the serializer when you call render :json. By default, this is current_user, but can be customized in your controller by calling serialization_scope:

``ruby
class ApplicationController < ActionController::Base
  serialization_scope :current_admin #right now it is :controller
end
``