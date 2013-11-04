class CreateActivityCategoryJoins < ActiveRecord::Migration
  def change
    create_table :activity_category_joins do |t|
      t.integer :activity_id
      t.integer :category_id

      t.timestamps
    end
    add_index :activity_category_joins, :activity_id
    add_index :activity_category_joins, :category_id
  end
end
