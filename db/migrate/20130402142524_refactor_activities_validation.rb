class RefactorActivitiesValidation < ActiveRecord::Migration
  def up
    change_column :activities, :headline, :string, null: true
    change_column :activities, :pick_date, :date, null: true
    change_column :activities, :pick_time, :time, null: true
    change_column :activities, :start_time, :time, null: true
    change_column :activities, :end_time, :time, null: true
  end

  def down
    change_column :activities, :headline, :string, null: false
    change_column :activities, :pick_date, :date, null: false
    change_column :activities, :pick_time, :time, null: false
    change_column :activities, :start_time, :time, null: false
    change_column :activities, :end_time, :time, null: false
  end
end
