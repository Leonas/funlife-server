require 'spec_helper'

describe User do
  it 'validates presence of name' do
    user = FactoryGirl.create(:user, email: '')
    user.valid?
    user.errors.should have_key(:email)
  end

  it 'doesn\'t allow special characters in name fields' do

  end

  it 'verifies email address through regex' do

  end

  it 'makes sure the email is unique' do

  end

  xit 'makes sure the user is over age 13' do

  end
end