class ActivityIconSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :street_address,
             :zip_code,
             :city,
             :longitude,
             :latitude,
             :time_open,
             :time_close,
             :phone,
             :description,
             :liked_by




  def liked_by

  end

end
