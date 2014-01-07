class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :first_name
      t.string :last_name
      t.string :name
      t.string :password_digest
      t.string :token
      t.string :gender
      t.date   :birthday
      t.integer :cover_photo_id
      t.integer :avatar_id
      t.integer :following_count, default: 0
      t.integer :followers_count, default: 0

      t.timestamps
    end
  end
end
