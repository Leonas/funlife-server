class AddUnreadColumnToChatMessage < ActiveRecord::Migration
  def change
    add_column :chat_messages, :unread, :boolean
  end
end
