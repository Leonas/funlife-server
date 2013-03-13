class UsersController < ApplicationController

  before_filter :authorize, only: [:index]

  def options
    cors_preflight_check
  end

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
  def register1
    @user = User.new(params[:user])
    if @user.save
      render json: {token: @user.token.to_s}
    else
      head :conflict
    end
  end

  def register2
    data = params[:user]
    first_name = data['first_name']
    last_name = data['last_name']

    @user=User.find_by_token(request.env['HTTP_TOKEN'])


    if @user.nil?
      render json: {token: 'error'}
    else
      @user.first_name = first_name
      @user.last_name = last_name
      @user.full_name = "#{first_name} #{last_name}"
      @user.save
      render json: {name: @user.full_name, email: @user.email, token: @user.token}
    end


  end

  def login
    data = params[:user]
    email = data['email']
    password = data['password']


    @user=User.find_by_email(email)

    if @user.nil?
      head :unauthorized
    elsif @user.authenticate(password)
      render json: {token: @user.token, email: @user.email, first_name: @user.first_name, last_name: @user.last_name}
    else
      head :unauthorized
    end
  end


  #This has not been checked if it works yet
  def log_out
    @user=User.find_by_token(request.env['HTTP_TOKEN'])
    if @user.nil?
      head :not_found
    else
      @user.reset_authentication_token!
      head :ok
    end
  end

  def auth
    if User.find_by_token(request.env['HTTP_TOKEN'])
      head :ok
    else
      head :not_found
    end
  end

end