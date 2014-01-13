class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string  :name
      t.string  :street_address
      t.integer :zip_code
      t.string  :city
      t.decimal :longitude
      t.decimal :latitude
      t.string  :time_open
      t.string  :time_close
      t.string  :phone
      t.string  :summary
      t.string  :description
      t.boolean :visible, default: false

      t.timestamps
    end
  end
end
