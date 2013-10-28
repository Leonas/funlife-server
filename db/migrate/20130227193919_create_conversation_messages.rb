class CreateConversationMessages < ActiveRecord::Migration
  def change
    create_table :conversation_messages do |t|

      t.timestamps
    end
  end
end
