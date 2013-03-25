require 'spec_helper'


describe 'signup/login screen' do

  after :each do
    page.execute_script('localStorage.clear()')
  end

  xit 'loads' do
    visit root_path
    page.should have_content 'FunLife'
  end

  xit 'lets me login' do
    user = FactoryGirl.create(:user)
    log_in(user)
  end

  xit 'gives error on wrong login' do
    user = FactoryGirl.build(:user)
    visit root_path
    sleep 1
    within('#login_holder') do
      fill_in 'user[email]', :with => user.email
      fill_in 'user[password]', :with => user.password
    end
    click_link 'Login'
    page.should have_content 'Wrong Password'
  end

  xit 'lets me register' do
    user = FactoryGirl.build(:user)
    visit root_path
    sleep 1
    page.should_not have_content 'Tell us a little'
    within('#login_holder') do
      fill_in 'user[email]', :with => user.email
      fill_in 'user[password]', :with => user.password
    end
    click_link 'Register'
    sleep 1
    page.should have_content 'Tell us a little'
    within('#registration_details') do
      fill_in 'user[first_name]', :with => user.first_name
      fill_in 'user[last_name]', :with => user.last_name
    end
    click_link 'Complete Registration'
    page.should have_content "Today's Activities"
  end

  xit 'gives error if I try to register with used email' do
    user = FactoryGirl.create(:user)
    visit root_path
    sleep 1
    within('#login_holder') do
      fill_in 'user[email]', :with => user.email
      fill_in 'user[password]', :with => user.password
    end
    click_link 'Register'
    page.should have_content 'already exists'
  end

end
