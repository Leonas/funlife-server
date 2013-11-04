class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.integer :activity_type_id
      t.string  :activity_type_type
      t.string :name
      t.string :icon_url
    end
  end
end
