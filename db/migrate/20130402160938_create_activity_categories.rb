class CreateActivityCategories < ActiveRecord::Migration
  def change
    create_table :activity_categories do |t|
      t.references :activity
      t.references :category

      t.timestamps
    end
    add_index :activity_categories, :activity_id
    add_index :activity_categories, :category_id
  end
end
