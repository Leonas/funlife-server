source 'https://rubygems.org'


gem 'rails-api'
gem 'rails', '~> 3.2.13'
gem 'bcrypt-ruby', '~> 3.0.0'  # Adds has_secure_password

gem 'newrelic_rpm'

# Use yajl for JSON encode/decode
gem 'yajl-ruby', require: 'yajl', require: 'yajl/json_gem'


gem "active_model_serializers", github: 'rails-api/active_model_serializers'

# Pagination
gem 'kaminari'

group :production do
  gem 'pg'


  #gem 'puma'        #procfile = web: bundle exec rails server puma -p $PORT -e $RACK_ENV
  #gem 'thin'        #procfile = web: bundle exec rails server thin -p $PORT -e $RACK_ENV
  gem 'unicorn'      #procfile = web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
end


group :test do
  gem 'cucumber-rails', require: false
  gem 'database_cleaner', "1.0.1"
  gem "simplecov", "~> 0.6.4"
  gem 'shoulda-matchers', "~> 1.5.0"
end


group :development, :test do
  gem 'growl'
  gem 'sqlite3'
  gem 'httparty'
  gem 'json_spec', github: 'marshallshen/json_spec'

  gem 'rspec-rails'
  gem 'guard-rspec'
  gem 'cucumber'


  gem 'wdm', :platforms => [:mswin, :mingw], require: false     #Speed up spork/guard on windows
  gem 'rb-fsevent', require: false                              #Speed up spork/guard on osx
  gem 'rb-inotify', require: false                              #Speed up spork/guard on linux

  gem 'guard-spork'
  gem 'spork-rails'

  gem 'factory_girl_rails'
  gem 'faker'

  #gem 'rspec_api_documentation', github: 'zipmark/rspec_api_documentation'
  gem 'rspec_api_documentation', path: '/Users/Leonas/funlife-code/rspec_api_documentation'
end



