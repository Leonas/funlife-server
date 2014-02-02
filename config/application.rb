require File.expand_path('../boot', __FILE__)

require 'rails/all'

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  # Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production, use this line
   Bundler.require(:default, :assets, Rails.env)
end


module FunlifeServer
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)

    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    config.i18n.enforce_available_locales = true

    config.encoding = "utf-8"
    config.filter_parameters += [:password]
    config.active_support.escape_html_entities_in_json = true

    # Use SQL instead of Active Record's schema dumper when creating the database.
    # This is necessary if your schema can't be completely dumped by the schema dumper,
    # like if you have constraints or database-specific column types
    # config.active_record.schema_format = :sql

    config.active_record.whitelist_attributes = false   # using strong_parameters instead
    config.assets.enabled = false
    config.session_store = :disabled             #possibly use something else to speed things up
    config.beginning_of_week = :monday
    config.serve_static_assets = false
    config.action_controller.allow_forgery_protection = false #disable CSRF protection
    config.active_support.escape_html_entities_in_json = true
    config.active_support.use_standard_json_time_format = true # enables serializing dates to ISO 8601 format


    #config.action_dispatch.default_headers = {
    #    'X-Frame-Options'  => 'SAMEORIGIN',
    #    'X-XSS-Protection' => '1; mode=block',
    #    'X-Content-Type-Options' => 'nosniff'
    #}                                                    #is this really the default?




    config.generators do |g|
      g.assets          false
      g.helper          false
      g.fixture_replacement :factory_girl
      g.orm             :active_record
      g.stylesheets     false
      g.template_engine nil
    end

    console do
      # this block is called only when running console,
      # so we can safely require pry here
      require "pry"
      config.console = Pry
    end
  end
end
