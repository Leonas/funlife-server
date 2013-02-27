require 'spec_helper'

describe Chat do
  before :each do
    create_3_users  #defines @user1-3
    log_in(@user1)
  end

  after :each do
    DatabaseCleaner.clean
  end

  xit 'shows me a list of people I can chat with on the homepage' do
    page.should have_content('List of Users')
    page.should have_content(@user1.full_name)
  end

  describe 'a chat with one person' do
    before :each do

    end

    xit 'takes me to a chat window when I click someone\'s name' do
       page.should have_content(@user2.full_name)
       click_link("chat_#{@user2.id}")
       page.should have_content("Chatting with #{@user2.full_name}")
    end

    describe 'now in the chatroom' do
         before :each do
           page.should have_content(@user2.full_name)
           click_link("chat_#{@user2.id}")
           page.should have_content("Chatting with #{@user2.full_name}")
         end

         xit 'pulls up my previous messages with user2' do
           click_link("chat_#{@user2.id}")
           #make a factory for chats with embedded messages
           #check if old messages show
         end

         it 'makes a new message show up when i click send' do

         end

         it 'wont send blank messages' do

         end

         xit 'pops up messages from user2' do
           @user2.messages.create(Faker::Lorem.sentence)
           #not able to test push messages now so just use polling
           #wait for message poll time of 10 seconds
           sleep 10
           page.should have_content(@user2.messages.latest)
         end
    end

  end
end