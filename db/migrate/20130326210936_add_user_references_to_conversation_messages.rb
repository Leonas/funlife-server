class AddUserReferencesToConversationMessages < ActiveRecord::Migration
  def change
    add_column :conversation_messages, :user_id, :integer
    add_index :conversation_messages, :user_id
  end
end
