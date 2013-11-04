class CreatePlaceUserJoins < ActiveRecord::Migration
  def change
    create_table :place_user_joins do |t|
      t.integer :place_id
      t.integer :user_id

      t.timestamps
    end
    add_index :place_user_joins, :place_id
    add_index :place_user_joins, :user_id

  end
end
