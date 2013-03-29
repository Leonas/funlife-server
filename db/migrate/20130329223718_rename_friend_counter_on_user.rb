class RenameFriendCounterOnUser < ActiveRecord::Migration
  def up
    rename_column :users, :friends_count, :following_count
  end

  def down
    rename_column :users, :friends_count, :following_count
  end
end
