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

ActiveRecord::Schema.define(:version => 20130404150642) do

  create_table "activities", :force => true do |t|
    t.integer  "user_id"
    t.string   "headline"
    t.text     "details"
    t.time     "start_time"
    t.time     "end_time"
    t.boolean  "allow_join",      :default => false
    t.integer  "maximum_users"
    t.string   "waitlist"
    t.decimal  "cost"
    t.boolean  "everyone",        :default => false
    t.boolean  "women",           :default => false
    t.boolean  "men",             :default => false
    t.boolean  "verified",        :default => false
    t.boolean  "trusted",         :default => false
    t.integer  "star_age"
    t.integer  "end_age"
    t.datetime "created_at",                         :null => false
    t.datetime "updated_at",                         :null => false
    t.string   "address"
    t.date     "date"
    t.integer  "attendees_count", :default => 0
  end

  add_index "activities", ["user_id"], :name => "index_activities_on_user_id"

  create_table "activity_categories", :force => true do |t|
    t.integer  "activity_id"
    t.integer  "category_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "activity_categories", ["activity_id"], :name => "index_activity_categories_on_activity_id"
  add_index "activity_categories", ["category_id"], :name => "index_activity_categories_on_category_id"

  create_table "attendees", :force => true do |t|
    t.integer  "user_id"
    t.integer  "activity_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "attendees", ["activity_id"], :name => "index_attendees_on_activity_id"
  add_index "attendees", ["user_id"], :name => "index_attendees_on_user_id"

  create_table "categories", :force => true do |t|
    t.string   "name",       :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "conversation_messages", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "user_id"
    t.integer  "conversation_id"
    t.string   "message"
    t.boolean  "unread"
  end

  add_index "conversation_messages", ["conversation_id"], :name => "index_conversation_messages_on_conversation_id"
  add_index "conversation_messages", ["user_id"], :name => "index_conversation_messages_on_user_id"

  create_table "conversations", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "comments", :force => true do |t|
    t.integer  "user_id",                       :null => false
    t.integer  "photo_id",                      :null => false
    t.text     "body",                          :null => false
    t.integer  "parent_id"
    t.integer  "children_count", :default => 0
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
  end

  add_index "comments", ["photo_id"], :name => "index_comments_on_photo_id"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "friendships", :force => true do |t|
    t.integer  "following_id"
    t.integer  "follower_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "friendships", ["follower_id"], :name => "index_friendships_on_follower_id"
  add_index "friendships", ["following_id"], :name => "index_friendships_on_friend_id"

  create_table "invitations", :force => true do |t|
    t.integer  "user_id",     :null => false
    t.integer  "activity_id", :null => false
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "invitations", ["activity_id"], :name => "index_invitations_on_activity_id"
  add_index "invitations", ["user_id"], :name => "index_invitations_on_user_id"

  create_table "likes", :force => true do |t|
    t.integer  "user_id"
    t.integer  "photo_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "likes", ["photo_id"], :name => "index_likes_on_photo_id"
  add_index "likes", ["user_id"], :name => "index_likes_on_user_id"

  create_table "photos", :force => true do |t|
    t.integer  "user_id"
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
    t.datetime "created_at",                    :null => false
    t.datetime "updated_at",                    :null => false
    t.integer  "comments_count", :default => 0
    t.datetime "processed_at"
    t.integer  "likes_count",    :default => 0
  end

  add_index "photos", ["user_id"], :name => "index_photos_on_user_id"

  create_table "conversation_users", :force => true do |t|
    t.integer  "conversation_id"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "conversation_users", ["conversation_id"], :name => "index_conversation_users_on_conversation_id"
  add_index "conversation_users", ["user_id"], :name => "index_conversation_users_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email"
    t.string   "password_digest"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "token"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.integer  "following_count", :default => 0
    t.integer  "followers_count", :default => 0
    t.string   "gender"
    t.date     "birthday"
    t.integer  "likes_count",     :default => 0
  end

end
