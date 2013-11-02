class AddConversationReferencesToConversationMessages < ActiveRecord::Migration
  def change
    add_column :conversation_messages, :conversation_id, :integer
    add_index :conversation_messages, :conversation_id
  end
end
