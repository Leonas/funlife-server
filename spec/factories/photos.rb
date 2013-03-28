# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :photo do
    user nil
    public_id "MyString"
    version "MyString"
    signature "MyString"
    width "MyString"
    height "MyString"
    format "MyString"
    resource_type "MyString"
    bytes "MyString"
    type ""
    url "MyString"
    secure_url "MyString"
  end
end
