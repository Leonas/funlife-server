
FactoryGirl.define do
  factory :photo do

    ignore do
      user nil           #remove this and update to how comments factory is
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

      if evaluator.user
        evaluator.user.photos << photo
        evaluator.user.save!
      end
    end

  end
end
