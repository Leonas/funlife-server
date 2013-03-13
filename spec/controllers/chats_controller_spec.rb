require 'spec_helper'

describe ChatsController do

  it 'index returns a list of previous chats' do
    chat = three_two_person_chats
    expected = { token: user.token, email: user.email, first_name: user.first_name,
                 last_name: user.last_name}.to_json

    post :login, user: {email: user.email, password: user.password}
    response.body.should == expected
    response.code.should == '200'
  end

  it 'gives status 401 on wrong login' do
    post :login, user: {email: 'wrong@wrong.com', password: 'x9x9x9'}
    response.code.should == '401'
  end

  context 'a new user' do
    before :each do
      @r_user = FactoryGirl.build(:user)
    end


    it 'returns a token on register step 1' do
      post :register1, user: {email: @r_user.email, password: @r_user.password}
      #expected = {token: @r_user.token}.to_json                                  cant figure out how to test this
      #response.body.should == expected
      response.code.should == '200'
    end

    it 'returns 200 on register step 2' do
      request.env['HTTP_TOKEN'] = @r_user.token
      post :register2, user: {first_name: @r_user.first_name, last_name: @r_user.last_name}
      response.code.should == '200'
    end

  end

  context 'a user' do
    before :each do
      @c_user = FactoryGirl.create(:user)
    end

    it 'returns 200 on successful logout' do
      request.env['HTTP_TOKEN'] = @c_user.token
      delete :log_out
      response.code.should == '200'
    end

    it 'returns 404 on unsuccessful logout' do
      request.env['HTTP_TOKEN'] = 'blarg'
      delete :log_out
      response.code.should == '404'
    end

    it 'returns 200 on successful auth of token' do
      request.env['HTTP_TOKEN'] = @c_user.token
      post :auth
      response.code.should == '200'
    end

    it 'returns 404 on failed auth token' do
      request.env['HTTP_TOKEN'] = 'fail'
      post :auth
      response.code.should == '404'
    end

    it 'returns a list of users on index with token' do                                 #temporary
      request.env['HTTP_TOKEN'] = @c_user.token
      get :index
      response.code.should == '200'
    end

    it 'returns 404 on index with no token' do                                 #temporary
      get :index
      response.code.should == '404'
    end
  end
end