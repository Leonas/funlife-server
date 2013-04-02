class RefactorActivitiesValidation < ActiveRecord::Migration
  def up
    change_column :activities, :headline, :string, null: true
    change_column :activities, :pick_date, :string, null: true
    change_column :activities, :pick_time, :string, null: true
    change_column :activities, :start_time, :string, null: true
    change_column :activities, :end_time, :string, null: true
  end

  def down
    change_column :activities, :headline, :string, null: false
    change_column :activities, :pick_date, :string, null: false
    change_column :activities, :pick_time, :string, null: false
    change_column :activities, :start_time, :string, null: false
    change_column :activities, :end_time, :string, null: false
  end
end
