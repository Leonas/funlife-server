class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :user_id, null: false
      t.integer :photo_id, null: false
      t.string :body, null: false
      t.integer :parent_id
      t.integer :children_count, default: 0

      t.timestamps
    end
    add_index :comments, :user_id
    add_index :comments, :photo_id
  end
end
