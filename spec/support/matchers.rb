def log_in(user)
  #This should be updated with the database cleaner. goddamn.
  visit ('http://localhost:3000')
  within('#login_holder') do
    fill_in 'user[email]', :with => user.email
    fill_in 'user[password]', :with => user.password
  end
  click_link 'Login'
  page.should have_content 'List of Users'
  page.should have_content user.full_name
end

def create_3_users
  @user1 = FactoryGirl.create(:user)
  @user2 = FactoryGirl.create(:user)
  @user3 = FactoryGirl.create(:user)
end