source 'https://rubygems.org'


gem 'rails-api'
gem "active_model_serializers", github: 'rails-api/active_model_serializers'
gem 'rails', '~> 3.2.13'
gem 'bcrypt-ruby', '~> 3.0.0'  # Adds has_secure_password

gem 'newrelic_rpm'


gem 'yajl-ruby', require: 'yajl', require: 'yajl/json_gem' #JSON encode/decode
gem 'kaminari'  # Pagination
#gem 'cancan'   #this hasn't been implemented yet but should be


group :production do
  gem 'pg'
  #gem 'puma'        #procfile = web: bundle exec rails server puma -p $PORT -e $RACK_ENV
  #gem 'thin'        #procfile = web: bundle exec rails server thin -p $PORT -e $RACK_ENV
  gem 'unicorn'      #procfile = web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
end



group :development, :test do
  gem 'database_cleaner', "1.0.1"
  gem "simplecov", "~> 0.6.4"


  gem 'growl'
  gem 'sqlite3'
  gem 'httparty'


  gem 'rspec-rails'
  gem 'factory_girl_rails'
  gem 'faker'
  gem 'timecop'
  gem 'shoulda-matchers'


  gem 'guard'
  gem 'guard-process'
  gem 'guard-rspec'
  gem 'guard-spork'
  gem 'guard-rake'
  gem 'spork-rails'
  gem 'wdm', :platforms => [:mswin, :mingw], require: false     #Speed up spork/guard on windows
  gem 'rb-fsevent', require: false                              #Speed up spork/guard on osx
  gem 'rb-inotify', require: false                              #Speed up spork/guard on linux


  gem 'awesome_print'
  gem 'rspec_to_iodocs', path: '/Users/Leonas/funlife-code/rspec_to_iodocs'
  gem 'json_spec', github: 'Leonas/json_spec'
end


