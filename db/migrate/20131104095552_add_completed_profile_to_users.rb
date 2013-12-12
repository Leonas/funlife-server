class AddCompletedProfileToUsers < ActiveRecord::Migration
  def change
    add_column :users, :completed_profile, :boolean
  end
end
