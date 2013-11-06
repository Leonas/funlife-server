class CreateAttendees < ActiveRecord::Migration
  def change
    create_table :attendees do |t|
      t.integer :user_id
      t.integer :event_id

      t.timestamps
    end
    add_index :attendees, :user_id
    add_index :attendees, :event_id
  end
end
