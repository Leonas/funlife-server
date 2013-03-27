class CreateUserChats < ActiveRecord::Migration
  def change
    create_table :user_chats do |t|
      t.references :chat
      t.references :user

      t.timestamps
    end
    add_index :user_chats, :chat_id
    add_index :user_chats, :user_id
  end
end
