class CreateEventGuests < ActiveRecord::Migration
  def change
    create_table :event_guests do |t|
      t.integer :user_id
      t.integer :event_id
      t.string  :guest_state
      t.text    :message

      t.timestamps
    end
    add_index :event_guests, :user_id
    add_index :event_guests, :event_id
  end
end
