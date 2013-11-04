class CreateConversationMessages < ActiveRecord::Migration
  def change
    create_table :conversation_messages do |t|
      t.integer :user_id

      t.timestamps
    end
    add_index :conversation_messages, :user_id
  end
end
