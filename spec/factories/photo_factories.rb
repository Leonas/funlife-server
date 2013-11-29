
FactoryGirl.define do
  factory :photo do

    ignore do
      uploaded_by nil
    end

    bytes         "x"
    format        "x"
    height        "x"
    width         "x"
    public_id     "x"
    url           "x"
    secure_url    "x"
    signature     "x"
    version       "x"



    after(:create) do |photo, evaluator|

      if evaluator.uploaded_by
        evaluator.uploaded_by.photos << photo
        evaluator.uploaded_by.save!
      end
    end

  end
end
