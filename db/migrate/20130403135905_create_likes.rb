class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
      t.references :user
      t.references :photo

      t.timestamps
    end
    add_index :likes, :user_id
    add_index :likes, :photo_id
  end
end
