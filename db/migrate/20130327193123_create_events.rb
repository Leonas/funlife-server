class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string  :title
      t.string  :details
      t.date    :date
      t.time    :start_time
      t.time    :end_time
      t.time    :duration
      t.string  :visibility
      t.integer :min_age
      t.integer :max_age
      t.boolean :activated,  default: false

      t.timestamps
    end
  end
end
