class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.references :user
      t.string :headline, null: false
      t.text :details
      t.time :pick_time, null: false
      t.date :pick_date, null: false
      t.time :start_time, null: false
      t.time :end_time, null: false
      t.boolean :allow_join, default: false
      t.integer :maximum_users
      t.string :waitlist
      t.decimal :cost
      t.boolean :everyone, default: false
      t.boolean :women, default: false
      t.boolean :men, default: false
      t.boolean :verified, default: false
      t.boolean :trusted, default: false
      t.integer :star_age
      t.integer :end_age

      t.timestamps
    end
    add_index :activities, :user_id
  end
end
