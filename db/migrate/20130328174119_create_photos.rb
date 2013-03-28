class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.references :user
      t.string :public_id
      t.string :version
      t.string :signature
      t.string :width
      t.string :height
      t.string :format
      t.string :resource_type
      t.string :bytes
      t.string :type
      t.string :url
      t.string :secure_url

      t.timestamps
    end
    add_index :photos, :user_id
  end
end
