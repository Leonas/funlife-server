class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string   :title
      t.text     :details
      t.datetime :start_time
      t.datetime :end_time
      t.integer  :duration_minutes
      t.string   :visibility
      t.integer  :min_age
      t.integer  :max_age
      t.integer  :cover_photo_id
      t.string   :street_address
      t.integer  :zip_code
      t.string   :city
      t.string   :state
      t.decimal  :longitude
      t.decimal  :latitude
      t.boolean  :activated,  default: false

      t.timestamps
    end
  end
end
