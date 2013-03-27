class AddChatReferencesToChatMessages < ActiveRecord::Migration
  def change
    add_column :chat_messages, :chat_id, :integer
    add_index :chat_messages, :chat_id
  end
end
