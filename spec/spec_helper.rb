require 'rubygems'
require 'spork'
require 'simplecov'
ENV["RAILS_ENV"] ||= 'test'
SimpleCov.start 'rails'

#require 'spork/ext/ruby-debug'

Spork.prefork do
  #require 'rubygems'
  #
  #ENV['RAILS_ENV'] ||= 'test'
  require File.expand_path('../../config/environment', __FILE__)
  require 'rspec/rails'
  require 'rspec/autorun'
  require 'database_cleaner'

  #Requires supporting ruby files with custom matchers, macros, etc in spec/support/.
  Dir[Rails.root.join('spec/support/**/*.rb')].each {|f| require f}

  Factory = FactoryGirl

  RSpec.configure do |config|
    config.include JsonSpec::Helpers
    #config.include FactoryGirl::Syntax::Methods

    config.tty = true
    config.color_enabled = true
   # config.formatter = :progress

    config.order = 'random'
    config.use_transactional_fixtures = false    #let Database cleaner handle transactions

    config.before(:each) { DatabaseCleaner.start }
    config.after(:each)  { DatabaseCleaner.clean }
  end

  RspecToIodocs.configure do |config|
    config.docs_dir = Rails.root.join("..", "funlife-docs", "public", "data")
    config.format = :json_iodocs
    config.api_name = "funlife"
    config.clear_directory = false
  end
end

Spork.each_run do
  DatabaseCleaner.clean_with :truncation
end
