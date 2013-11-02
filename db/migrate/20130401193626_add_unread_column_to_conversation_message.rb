class AddUnreadColumnToConversationMessage < ActiveRecord::Migration
  def change
    add_column :conversation_messages, :unread, :boolean
  end
end
