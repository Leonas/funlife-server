class RenameFriendIdColumnToFollowindIdOnFrinship < ActiveRecord::Migration
  def up
    rename_column :friendships, :friend_id, :following_id
  end

  def down
    rename_column :friendships, :following_id, :friend_id
  end
end
