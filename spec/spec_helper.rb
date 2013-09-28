require 'rubygems'
require 'spork'
require 'simplecov'
ENV["RAILS_ENV"] ||= 'test'
SimpleCov.start 'rails'

#require 'spork/ext/ruby-debug'

Spork.prefork do
  require 'rubygems'

  ENV['RAILS_ENV'] ||= 'test'
  require File.expand_path('../../config/environment', __FILE__)
  require 'rspec/rails'

  require 'rspec/autorun'


  require 'database_cleaner'


  #Capybara.ignore_hidden_elements = true           this causes problems

  #Requires supporting ruby files with custom matchers, macros, etc in spec/support/.
  Dir[Rails.root.join('spec/support/**/*.rb')].each {|f| require f}

  RSpec.configure do |config|
    # Use color in STDOUT
    config.color_enabled = true
    # Use color not only in STDOUT but also in pagers and files
    config.tty = true
    # Use the specified formatter
    config.formatter = :progress #:documentation # :progress, :html, :textmate

    config.order = 'random'
    config.use_transactional_fixtures = false

    #config.include JsonSpec::Helpers

    config.before(:suite) do
      DatabaseCleaner.strategy = :truncation
      DatabaseCleaner.clean
    end

    config.before(:each) do
      DatabaseCleaner.start
    end

    config.after(:each) do
      DatabaseCleaner.clean
    end

  end

  RspecApiDocumentation.configure do |config|
    config.docs_dir = Rails.root.join("..", "iodocs", "public", "data")
    config.format = :json_iodocs
    config.api_name = "funlife"
    config.clear_directory = false
  end

end

Spork.each_run do
  #do something here each time spork is run

end
