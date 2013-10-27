class RenameUserConversationToConversationUser < ActiveRecord::Migration
  def up
    rename_table :conversation_users, :conversation_users
  end

  def down
    rename_table :conversation_users, :conversation_users
  end
end
