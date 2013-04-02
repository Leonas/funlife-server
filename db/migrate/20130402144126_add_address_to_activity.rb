class AddAddressToActivity < ActiveRecord::Migration
  def change
    add_column :activities, :address, :string
  end
end
