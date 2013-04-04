class AddAttendeesCounterToActivity < ActiveRecord::Migration
  def change
    add_column :activities, :attendees_count, :integer, default: 0
  end
end
