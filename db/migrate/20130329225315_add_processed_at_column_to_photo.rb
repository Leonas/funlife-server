class AddProcessedAtColumnToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :processed_at, :timestamp
  end
end
