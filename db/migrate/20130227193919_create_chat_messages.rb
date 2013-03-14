class CreateChatMessages < ActiveRecord::Migration
  def change
    create_table :chat_messages do |t|

      t.timestamps
    end
  end
end
