class PhotoAuthSerializer < ActiveModel::Serializer
  attributes :unix_timestamp,
             :api_key,
             :upload_url,
             :unique_photo_id,
             :cloudinary_signature
end
