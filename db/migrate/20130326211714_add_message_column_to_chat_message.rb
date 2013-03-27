class AddMessageColumnToChatMessage < ActiveRecord::Migration
  def change
    add_column :chat_messages, :message, :string
  end
end
