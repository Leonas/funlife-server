class RefactorActivitiesValidation < ActiveRecord::Migration
  def up
    change_column :activities, :headline, :string, null: true
    remove_column :activities, :pick_date
    remove_column :activities, :pick_time
    change_column :activities, :start_time, :time, null: true
    change_column :activities, :end_time, :time, null: true
  end

  def down
    change_column :activities, :headline, :string, null: false
    add_column :activities, :pick_date, :date, null: false
    add_column :activities, :pick_time, :time, null: false
    change_column :activities, :start_time, :time, null: false
    change_column :activities, :end_time, :time, null: false
  end
end
