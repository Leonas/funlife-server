class CreateActivityEventJoins < ActiveRecord::Migration
  def change
    create_table :activity_event_joins do |t|
      t.integer :activity_id
      t.integer :event_id

      t.timestamps
    end
    add_index :activity_event_joins, :activity_id
    add_index :activity_event_joins, :event_id
  end
end
