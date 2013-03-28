class CreateFriendships < ActiveRecord::Migration
  def change
    create_table :friendships do |t|
      t.integer :friend_id
      t.integer :follower_id

      t.timestamps
    end

    add_index :friendships, :friend_id
    add_index :friendships, :follower_id
  end
end
