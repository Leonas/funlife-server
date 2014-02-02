FunlifeServer::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  config.cache_classes = false
  config.cache_store = :null_store
  config.whiny_nils = true
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.log_level = :debug
  config.action_mailer.raise_delivery_errors = false # Don't care if the mailer can't send
  config.active_support.deprecation = :log # Print deprecation notices to the Rails logger
  config.action_dispatch.best_standards_support = :builtin # Only use best-standards-support built into browsers
  config.active_record.mass_assignment_sanitizer = :strict # Raise exception on mass assignment protection for Active Record models
  config.active_record.auto_explain_threshold_in_seconds = 0.5 # Log the query plan for queries taking more than this

end
