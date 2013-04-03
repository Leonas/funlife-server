class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.references :user
      t.references :activity

      t.timestamps
    end
    add_index :invitations, :user_id
    add_index :invitations, :activity_id
  end
end
