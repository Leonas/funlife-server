class AddCommentCounterToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :comments_count, :integer, default: 0
  end
end
