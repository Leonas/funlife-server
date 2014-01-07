class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :commentable_id
      t.string  :commentable_type
      t.string  :text
      t.integer :user_id
      t.integer :parent_id
      t.integer :children_count, default: 0

      t.timestamps
    end
    add_index :comments, :user_id
  end
end
