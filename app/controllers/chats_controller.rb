class ChatsController < ApplicationController
  before_filter :set_chat, only: [:show, :destroy, :update]
  # GET /chats
  # GET /chats.json
  def index
    @chats = @current_user.chats
    render json: @chats
  end

  # GET /chats/1
  # GET /chats/1.json
  def show
    render json: @chat
  end

  # GET /chats/new
  # GET /chats/new.json
  def new
    @chat = @current_user.chats.new

    render json: @chat
  end

  # POST /chats
  # POST /chats.json
  def create
    @chat = @current_user.chats.build(params[:chat])

    if @chat.save
      #FIXME save should assign the current_user
      @chat.users << @current_user
      render json: @chat, status: :created, location: @chat
    else
      render json: @chat.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chats/1
  # DELETE /chats/1.json
  def destroy
    @chat.destroy

    head :no_content
  end

  private

  def set_chat
    @chat = @current_user.chats.find(params[:id])
  end
end
