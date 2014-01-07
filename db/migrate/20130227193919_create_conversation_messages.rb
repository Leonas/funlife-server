class CreateConversationMessages < ActiveRecord::Migration
  def change
    create_table :conversation_messages do |t|
      t.integer :user_id
      t.integer :conversation_id
      t.string  :text

      t.timestamps
    end
    add_index :conversation_messages, :user_id
    add_index :conversation_messages, :conversation_id
  end
end
