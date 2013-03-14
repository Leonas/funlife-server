#require 'spec_helper'
#
#describe Chat do
#  before :each do
#    create_3_users
#  end
#
#  it 'gets created with 2 users' do
#
#  end
#
#  it 'throws an error if more than 2 users are passed' do
#    FactoryGirl.create(:chat, users: [@user1.id, @user2.id, @user3.id])
#
#  end
#
#  it 'throws an error if one or no users are passed' do
#    FactoryGirl.create(:chat, users: [@user1.id]).should give_error
#    FactoryGirl.create(:chat, users: []).should give_error
#  end
#
#  it 'keeps track of what message belong to what user' do
#
#  end
#
#  it 'gives a message count' do
#
#  end
#
#
#end