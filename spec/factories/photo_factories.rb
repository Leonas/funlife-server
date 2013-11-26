
FactoryGirl.define do
  factory :photo do

    ignore do
      uploaded_by nil
    end

    bytes         "x"
    format        "x"
    height        "x"
    public_id     "x"
    resource_type "x"
    secure_url    "x"
    signature     "x"
    url           "x"
    version       "x"
    width         "x"
    type          "x"


    after(:create) do |photo, evaluator|

      if evaluator.uploaded_by
        evaluator.uploaded_by.photos << photo
        evaluator.uploaded_by.save!
      else
        photo.user << create(:user)
      end
    end

  end
end
