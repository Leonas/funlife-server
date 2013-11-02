class AddMessageColumnToConversationMessage < ActiveRecord::Migration
  def change
    add_column :conversation_messages, :message, :string
  end
end
