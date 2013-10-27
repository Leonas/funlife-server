class RenameConversationMessageToConversationMessage < ActiveRecord::Migration
  def up
    rename_table :conversation_messages, :conversation_messages
  end

  def down
    rename_table :conversation_messages, :conversation_messages
  end
end
