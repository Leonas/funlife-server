
def log_in(user)
  visit root_path
  page.should_not have_content "Today's Activities"
  sleep 1
  within('#login_form') do
    fill_in 'user[email]', :with => user.email
    fill_in 'user[password]', :with => user.password
  end
  click_link 'Login'
  sleep 1
  page.should have_content "Today's Activities"

end

def create_3_users
  @user1 = FactoryGirl.create(:user)
  @user2 = FactoryGirl.create(:user)
  @user3 = FactoryGirl.create(:user)
end

def three_two_person_chats

end