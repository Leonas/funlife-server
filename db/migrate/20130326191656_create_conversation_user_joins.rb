class CreateConversationUserJoins < ActiveRecord::Migration
  def change
    create_table :conversation_user_joins do |t|
      t.integer :conversation_id
      t.integer :user_id
      t.boolean :hidden

      t.timestamps
    end
    add_index :conversation_user_joins, :conversation_id
    add_index :conversation_user_joins, :user_id
  end
end
