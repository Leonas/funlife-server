class CreateActivitiesCategoriesJoinTable < ActiveRecord::Migration
  def change
    create_table :activities_categories, id: false do |t|
      t.integer :activity_id
      t.integer :category_id
    end
    add_index :activities_categories, :activity_id
    add_index :activities_categories, :category_id
  end
end
