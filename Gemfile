source 'https://rubygems.org'
ruby '1.9.3'

gem 'rails-api'
gem 'rails', '~> 3.2.11'
gem 'json', '>= 1.7.7'
gem 'bcrypt-ruby', '~> 3.0.0'  # Adds has_secure_password

gem 'newrelic_rpm'

group :production do
  gem 'pg'


  #gem 'puma'        #procfile = web: bundle exec rails server puma -p $PORT -e $RACK_ENV
  #gem 'thin'        #procfile = web: bundle exec rails server thin -p $PORT -e $RACK_ENV
  gem 'unicorn'      #procfile = web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
end




group :development, :test do
  gem 'sqlite3'
  gem 'sass'
  #gem 'guard-sass'          #This won't work for some reason
  gem 'httparty'

  gem 'rspec-rails'
  gem 'guard-rspec'

  gem 'wdm', :platforms => [:mswin, :mingw], :require => false     #Speed up spork/guard on windows
  gem 'rb-fsevent', :require => false                              #Speed up spork/guard on osx
  gem 'rb-inotify', :require => false                              #Speed up spork/guard on linux

  gem 'guard-spork'
  gem 'spork-rails'
  gem 'capybara'
  gem 'capybara-json'
  gem 'poltergeist'
  gem 'factory_girl_rails'
  gem 'database_cleaner'
  gem 'faker'
  gem 'shoulda'

end



