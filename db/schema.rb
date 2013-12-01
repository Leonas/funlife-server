# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20131104095551) do

  create_table "activities", :force => true do |t|
    t.string "name"
    t.string "icon_url"
  end

  create_table "activity_event_joins", :force => true do |t|
    t.integer  "activity_id"
    t.integer  "event_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "activity_event_joins", ["activity_id"], :name => "index_activity_event_joins_on_activity_id"
  add_index "activity_event_joins", ["event_id"], :name => "index_activity_event_joins_on_event_id"

  create_table "activity_place_joins", :force => true do |t|
    t.integer  "activity_id"
    t.integer  "place_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "activity_place_joins", ["activity_id"], :name => "index_activity_place_joins_on_activity_id"
  add_index "activity_place_joins", ["place_id"], :name => "index_activity_place_joins_on_place_id"

  create_table "comments", :force => true do |t|
    t.integer  "commentable_id"
    t.string   "commentable_type"
    t.integer  "user_id",                         :null => false
    t.string   "body",                            :null => false
    t.integer  "parent_id"
    t.integer  "children_count",   :default => 0
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
  end

  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "conversation_messages", :force => true do |t|
    t.integer  "user_id"
    t.integer  "conversation_id"
    t.string   "message"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "conversation_messages", ["conversation_id"], :name => "index_conversation_messages_on_conversation_id"
  add_index "conversation_messages", ["user_id"], :name => "index_conversation_messages_on_user_id"

  create_table "conversation_user_joins", :force => true do |t|
    t.integer  "conversation_id"
    t.integer  "user_id"
    t.boolean  "hidden"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "conversation_user_joins", ["conversation_id"], :name => "index_conversation_user_joins_on_conversation_id"
  add_index "conversation_user_joins", ["user_id"], :name => "index_conversation_user_joins_on_user_id"

  create_table "conversations", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "event_guests", :force => true do |t|
    t.integer  "user_id"
    t.integer  "event_id"
    t.boolean  "attending"
    t.string   "message"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "event_guests", ["event_id"], :name => "index_event_guests_on_event_id"
  add_index "event_guests", ["user_id"], :name => "index_event_guests_on_user_id"

  create_table "events", :force => true do |t|
    t.string   "title"
    t.string   "details"
    t.date     "date"
    t.time     "start_time",                    :null => false
    t.time     "end_time",                      :null => false
    t.time     "duration",                      :null => false
    t.string   "visibility",                    :null => false
    t.integer  "min_age"
    t.integer  "max_age"
    t.boolean  "activated",  :default => false
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
  end

  create_table "photos", :force => true do |t|
    t.integer  "imageable_id"
    t.string   "imageable_type"
    t.string   "bytes"
    t.string   "format"
    t.string   "height"
    t.string   "width"
    t.string   "public_id"
    t.string   "url"
    t.string   "secure_url"
    t.string   "signature"
    t.string   "version"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "place_user_joins", :force => true do |t|
    t.integer  "place_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "place_user_joins", ["place_id"], :name => "index_place_user_joins_on_place_id"
  add_index "place_user_joins", ["user_id"], :name => "index_place_user_joins_on_user_id"

  create_table "places", :force => true do |t|
    t.string   "location_id"
    t.string   "location_type"
    t.string   "name"
    t.string   "street_address"
    t.integer  "zip_code"
    t.string   "city"
    t.decimal  "longitude"
    t.decimal  "latitude"
    t.string   "time_open"
    t.string   "time_close"
    t.string   "phone"
    t.string   "summary"
    t.string   "description"
    t.boolean  "featured",       :default => false
    t.datetime "created_at",                        :null => false
    t.datetime "updated_at",                        :null => false
  end

  create_table "relationships", :force => true do |t|
    t.integer  "follower_id"
    t.integer  "followed_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "relationships", ["followed_id"], :name => "index_relationships_on_followed_id"
  add_index "relationships", ["follower_id", "followed_id"], :name => "index_relationships_on_follower_id_and_followed_id", :unique => true
  add_index "relationships", ["follower_id"], :name => "index_relationships_on_follower_id"

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type", "context"], :name => "index_taggings_on_taggable_id_and_taggable_type_and_context"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password_digest"
    t.string   "token"
    t.string   "gender"
    t.date     "birthday"
    t.integer  "main_photo_id"
    t.integer  "avatar_id"
    t.integer  "following_count", :default => 0
    t.integer  "followers_count", :default => 0
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

  create_table "votes", :force => true do |t|
    t.integer  "votable_id"
    t.string   "votable_type"
    t.integer  "voter_id"
    t.string   "voter_type"
    t.boolean  "vote_flag"
    t.string   "vote_scope"
    t.integer  "vote_weight"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "votes", ["votable_id", "votable_type", "vote_scope"], :name => "index_votes_on_votable_id_and_votable_type_and_vote_scope"
  add_index "votes", ["votable_id", "votable_type"], :name => "index_votes_on_votable_id_and_votable_type"
  add_index "votes", ["voter_id", "voter_type", "vote_scope"], :name => "index_votes_on_voter_id_and_voter_type_and_vote_scope"
  add_index "votes", ["voter_id", "voter_type"], :name => "index_votes_on_voter_id_and_voter_type"

end
