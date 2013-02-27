class TokenAuthenticationsController < ApplicationController


  #skip_before_filter :verify_authenticity_token


  #This is for logging in
  def create
    logger.debug "The object is #{params[:user]}"


    data = params[:user]
    email = data['email']
    password = data['password']

    #Something should be done better here. This is just server checking valid email & length.
    if email.length < 2 or password.length < 2
      puts 'the password or email is too short. rendering token:error'
      render json: {token: 'error'}
      return
    end



    @user=User.find_by_email(email)

    if @user.nil?
      logger.info("User #{email} failed sign in, user cannot be found.")
      render json: {token: 'error'}
      return
    end


    if @user.authenticate(password)
      render json: {token: @user.token, name: @user.full_name, email: @user.email, id: @user.id}
    else
      logger.info("User #{email} failed sign in, password \"#{password}\" is invalid")
      render json: {token: 'error'}

    end
  end

  #This has not been checked if it works yet
  def destroy
    @user=User.find_by(token: params[:token])
    if @user.nil?
      logger.info('Token not found.')
      render json: {token: 'error'}
    else
      @user.reset_authentication_token!
      logger.info('token reset!')
      render json: {token: ''}
    end
  end

  def startup_login_check
    data = params[:user]
    token = data['data']
    if User.find_by(token: token)
      puts 'we found da token!!!'
      render json: {login: 'success'}
    else
      render json: {login: 'error'}
    end
  end


end
