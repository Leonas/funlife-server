class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string   :title
      t.string   :details
      t.datetime :start_time
      t.datetime :end_time
      t.integer  :duration_minutes
      t.string   :visibility
      t.integer  :min_age
      t.integer  :max_age
      t.integer  :cover_photo_id
      t.boolean  :activated,  default: false

      t.timestamps
    end
  end
end
