require 'spec_helper'


describe 'signup/login screen' do

  after :each do
    page.execute_script('localStorage.clear()')
  end

  it 'loads' do
    visit SITE_ROOT
#    binding.pry
    sleep 2
    page.should have_content 'FunLife'
    page.should have_content 'Email'
  end

  it 'lets me login' do
    user = FactoryGirl.create(:user)
    log_in(user)
  end

  it 'gives error on wrong login' do
    user = FactoryGirl.build(:user)
    visit @site_root
    within('#login_holder') do
      fill_in 'user[email]', :with => user.email
      fill_in 'user[password]', :with => user.password
    end
    click_link 'Login'
    page.should have_content 'Wrong Password'
  end

  it 'lets me register' do
    user = FactoryGirl.build(:user)
    visit @site_root
    within('#login_holder') do
      fill_in 'user[email]', :with => user.email
      fill_in 'user[password]', :with => user.password
    end
    click_link 'Register'
    sleep 0.5
    page.should have_content 'Thanks'
    within('#registration_details') do
      fill_in 'user[first_name]', :with => user.first_name
      fill_in 'user[last_name]', :with => user.last_name
    end
    click_link 'Complete Registration'
    page.should have_content 'List of Users'
    page.should have_content user.first_name
  end

  it 'gives error if I try to register with used email' do
    user = FactoryGirl.create(:user)
    visit @site_root
    within('#login_holder') do
      fill_in 'user[email]', :with => user.email
      fill_in 'user[password]', :with => user.password
    end
    click_link 'Register'
    page.should have_content 'already exists'
  end

end