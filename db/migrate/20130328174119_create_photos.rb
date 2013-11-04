class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.references :imageable, polymorphic: true
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
      t.string :type
      t.integer :comments_count, default: 0
      t.integer :likes_count, default: 0

      t.timestamps
    end
  end
end
