class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.references :activity_type, polymorphic: true
      t.string :name
      t.string :icon_url
    end
  end
end
