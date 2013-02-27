class UsersController < ApplicationController

  before_filter :authorize, only: [:index]

  def index
    @users = User.all
    @users_list = []

    #doing this to prevent private data from being sent
    @users.each do |user|
      # @users_list << "user_id: \"#{user.id}\", name: \"#{user.full_name}\", email: \"#{user.email}\""
      @users_list << {name: user.full_name, email: user.email, user_id: user.id}
    end

    render json: {users_list: @users_list}
  end

  #A user signs up - new user created with auth token
  def create
    @user = User.new(params[:user])
    if @user.save
      puts 'User saved successfully.'
      render json: {token: @user.token.to_s}
    else
      puts 'User failed to save'
      render json: {token: 'error'}
    end
  end

  def complete_registration
    data = params[:user]
    first_name = data['first_name']
    last_name = data['last_name']
    token = data['token']

    @user = User.find_by_token(token)
    puts "\n\n\n The following user was found via token" + @user.to_s
    if @user.nil?
      puts 'No user was found with that token'
      render json: {token: 'error'}
    else
      @user.first_name = first_name
      @user.last_name = last_name
      @user.full_name = "#{first_name} #{last_name}"
      puts "\n\n\n The user now looks like" + @user.to_s
      @user.save
      render json: {name: @user.full_name, email: @user.email, token: @user.token}
    end


  end

end