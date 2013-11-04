class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.references :user
      t.string :name
      t.text :details
      t.date :date
      t.time :time, null: false
      t.time :duration, null: false
      t.integer :max_attendance
      t.boolean :invite_only
      t.boolean :allow_women, default: false
      t.boolean :allow_men, default: false
      t.integer :allow_youngest_age
      t.integer :allow_oldest_age
      t.integer :attendees_count, default: 0

      t.timestamps
    end
    add_index :events, :user_id
  end
end
