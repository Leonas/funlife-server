class RenameConversationToConversation < ActiveRecord::Migration
  def up
    rename_table :conversations, :conversations
  end

  def down
    rename_table :conversations, :conversations
  end
end
