class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :commentable_id
      t.string  :commentable_type
      t.integer :user_id
      t.integer :parent_id, default: 0
      t.integer :depth, default: 0
      t.integer :children_count, default: 0
      t.text    :text



      t.timestamps
    end
    add_index :comments, :user_id
  end
end
