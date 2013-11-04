class RenameActivityCategoryToActivity < ActiveRecord::Migration
  def up
    rename_table :activity_categories, :activities
  end

  def down
    rename_table :activities, :activity_categories
  end
end
