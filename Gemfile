source "https://rubygems.org"

ruby "2.0.0"

gem "rails-api",                github: "rails-api/rails-api",                ref: "6c7f1d11fb86e38d6e5534278aa527098d9e4258"
gem "active_model_serializers", github: "rails-api/active_model_serializers", ref: "9436d73b9220b64a5940cfdaa176cab861b22441"


gem "bcrypt-ruby",         "~> 3.0.0"
gem "rails",               "~> 3.2.16"
gem "pg",                  "0.17.0"
gem "kaminari",            "~> 0.15.0"
gem "acts-as-taggable-on", "~> 3.0.1"
gem "acts_as_votable",     "~> 0.8.0"
gem "strong_parameters",   "~> 0.2.2"
gem "paper_trail",         "~> 3.0.0"
#gem "rails_admin",         "~> 0.6.0"   #REQUIRES RAILS 4
#gem 'rakismet'              #API Key: 1cb00c17c2f3      #anti-spam but not necessary if all posts are from paid members

#gem "whisper"       #pub/sub library for ruby
#add https://www.ruby-toolbox.com/categories/spam_detection


gem "yajl-ruby", "~> 1.2.0", require: "yajl", require: "yajl/json_gem" #does this make it so normal json gem is overwritten?


group :production do
  #gem "puma"        #procfile = web: bundle exec rails server puma -p $PORT -e $RACK_ENV
  #gem "thin"        #procfile = web: bundle exec rails server thin -p $PORT -e $RACK_ENV
  gem "unicorn"      #procfile = web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
  gem "newrelic_rpm"
end



group :development, :test do
 # gem "database_cleaner",   "1.0.1"
  gem "database_cleaner",   "~> 1.2.0"
  gem "simplecov",          "~> 0.6.4"


  gem "growl",              "~> 1.0.3"
  gem "httmultiparty",      "~> 0.3.10"


  gem "rspec-rails",        "~> 2.14.1"
  gem "factory_girl_rails", "~> 4.3.0"
  gem "timecop",            "~> 0.7.1"
  gem "shoulda-matchers",   "~> 2.5.0"
  gem "faker",              github: "stympy/faker", ref: "e259c9c5f7b861a6a2529a97d545d8b158d8c566"


  gem "guard",              "~> 2.2.5"
  gem "guard-process",      "~> 1.0.6"
  gem "guard-rspec",        "~> 4.2.4"
  gem "guard-spork",        "~> 1.5.1"
  gem "guard-rake",         "~> 0.0.9"
  gem "guard-brakeman",     "~> 0.8.1"

  gem "spork-rails",        "~> 4.0.0"
  gem "rb-fsevent",         "~> 0.9.4", require: false    #Speed up spork/guard on osx
  gem "rb-inotify",         "~> 0.9.3", require: false    #Speed up spork/guard on linux


  gem "awesome_print",      "~> 1.2.0"
  gem "rspec_to_iodocs",    path: "/Users/Leonas/funlife-code/rspec_to_iodocs"
  gem "json_spec",          github: "Leonas/json_spec"
  #gem "json_spec", path: "/Users/Leonas/funlife-code/json_spec"

end


