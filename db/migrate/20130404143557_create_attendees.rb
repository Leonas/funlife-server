class CreateAttendees < ActiveRecord::Migration
  def change
    create_table :attendees do |t|
      t.references :user
      t.references :activity

      t.timestamps
    end
    add_index :attendees, :user_id
    add_index :attendees, :activity_id
  end
end
