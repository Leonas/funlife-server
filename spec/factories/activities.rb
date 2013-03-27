# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :activity do
    user
    headline "MyString"
    details "MyText"
    pick_time "2013-03-27 14:31:23"
    pick_date "2013-03-27"
    start_time "2013-03-27 14:31:23"
    end_time "2013-03-27 14:31:23"
    allow_join false
    maximum_users 1
    waitlist "none"
    cost "9.99"
    everyone false
    women false
    men false
    verified false
    trusted false
  end
end
