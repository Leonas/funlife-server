class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string  :title
      t.string  :details
      t.date    :date
      t.time    :start_time, null: false
      t.time    :end_time,   null: false
      t.time    :duration,   null: false
      t.string  :visibility, null: false
      t.integer :min_age
      t.integer :max_age
      t.boolean :activated,  default: false

      t.timestamps
    end
  end
end
