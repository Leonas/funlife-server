FunlifeServer::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  config.cache_classes = false
  config.whiny_nils = true
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Raise exceptions instead of rendering exception templates
  config.action_dispatch.show_exceptions = false


  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test

  # Raise exception on mass assignment protection for Active Record models
  config.active_record.mass_assignment_sanitizer = :strict

  # Print deprecation notices to the stderr
  config.active_support.deprecation = :stderr

  config.log_level = :debug

  config.after_initialize do
    # Set Time.now to September 1, 2008 10:05:00 AM (at this instant), but allow it to move forward
    #t = Time.local(2000, 1, 1, 10, 0, 0)
    #Timecop.travel(t)
  end

end
