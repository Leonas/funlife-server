class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.integer :imageable_id
      t.string  :imageable_type
      t.string :bytes
      t.string :format
      t.string :height
      t.string :width
      t.string :public_id
      t.string :url
      t.string :secure_url
      t.string :signature
      t.string :version


      t.timestamps
    end
  end
end
