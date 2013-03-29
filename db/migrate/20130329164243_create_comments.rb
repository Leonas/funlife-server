class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.references :user, null: false
      t.references :photo, null: false
      t.text :body, null: false
      t.integer :parent_id
      t.integer :children_count, default: 0

      t.timestamps
    end
    add_index :comments, :user_id
    add_index :comments, :photo_id
  end
end
