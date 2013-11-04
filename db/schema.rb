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

ActiveRecord::Schema.define(:version => 20131104095548) do

  create_table "activities", :force => true do |t|
    t.integer "activity_type_id"
    t.string  "activity_type_type"
    t.string  "name"
    t.string  "icon_url"
  end

  create_table "activities_categories", :id => false, :force => true do |t|
    t.integer "activity_id"
    t.integer "category_id"
  end

  add_index "activities_categories", ["activity_id"], :name => "index_activities_categories_on_activity_id"
  add_index "activities_categories", ["category_id"], :name => "index_activities_categories_on_category_id"

  create_table "attendees", :force => true do |t|
    t.integer  "user_id"
    t.integer  "event_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "attendees", ["event_id"], :name => "index_attendees_on_event_id"
  add_index "attendees", ["user_id"], :name => "index_attendees_on_user_id"

  create_table "categories", :force => true do |t|
    t.string   "name",          :null => false
    t.integer  "activities_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "comments", :force => true do |t|
    t.integer  "user_id",                       :null => false
    t.integer  "photo_id",                      :null => false
    t.string   "body",                          :null => false
    t.integer  "parent_id"
    t.integer  "children_count", :default => 0
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
  end

  add_index "comments", ["photo_id"], :name => "index_comments_on_photo_id"
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

  create_table "conversation_users", :force => true do |t|
    t.integer  "conversation_id"
    t.integer  "user_id"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  add_index "conversation_users", ["conversation_id"], :name => "index_conversation_users_on_conversation_id"
  add_index "conversation_users", ["user_id"], :name => "index_conversation_users_on_user_id"

  create_table "conversations", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "events", :force => true do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "details"
    t.date     "date"
    t.time     "time",                                    :null => false
    t.time     "duration",                                :null => false
    t.integer  "max_attendance"
    t.boolean  "invite_only",          :default => false
    t.boolean  "allow_request_invite", :default => false
    t.boolean  "allow_women",          :default => false
    t.boolean  "allow_men",            :default => false
    t.integer  "allow_youngest_age"
    t.integer  "allow_oldest_age"
    t.integer  "attendees_count",      :default => 0
    t.datetime "created_at",                              :null => false
    t.datetime "updated_at",                              :null => false
  end

  add_index "events", ["user_id"], :name => "index_events_on_user_id"

  create_table "invitations", :force => true do |t|
    t.integer  "user_id",    :null => false
    t.integer  "event_id",   :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "invitations", ["event_id"], :name => "index_invitations_on_event_id"
  add_index "invitations", ["user_id"], :name => "index_invitations_on_user_id"

  create_table "photos", :force => true do |t|
    t.integer  "imageable_id"
    t.string   "imageable_type"
    t.string   "public_id"
    t.string   "version"
    t.string   "signature"
    t.string   "width"
    t.string   "height"
    t.string   "format"
    t.string   "resource_type"
    t.string   "bytes"
    t.string   "type"
    t.string   "url"
    t.string   "secure_url"
    t.integer  "comments_count", :default => 0
    t.integer  "likes_count",    :default => 0
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
  end

  create_table "places", :force => true do |t|
    t.string   "name"
    t.string   "street_address"
    t.integer  "zip_code"
    t.string   "city"
    t.decimal  "longitude"
    t.decimal  "latitude"
    t.time     "time_open"
    t.time     "time_close"
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

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "password_digest"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "token"
    t.string   "gender"
    t.date     "birthday"
    t.integer  "following_count", :default => 0
    t.integer  "followers_count", :default => 0
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
  end

end
