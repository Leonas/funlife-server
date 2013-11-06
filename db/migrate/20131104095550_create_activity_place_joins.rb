class CreateActivityPlaceJoins < ActiveRecord::Migration
  def change
    create_table :activity_place_joins do |t|
      t.integer :activity_id
      t.integer :place_id

      t.timestamps
    end
    add_index :activity_place_joins, :activity_id
    add_index :activity_place_joins, :place_id
  end
end
