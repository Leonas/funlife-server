class ChatsController < ApplicationController
  # GET /chats
  # GET /chats.json
  def index
    @chats = Chat.all

    render json: @chats
  end

  # GET /chats/1
  # GET /chats/1.json
  def show
    @chat = Chat.find(params[:id])

    render json: @chat
  end

  # GET /chats/new
  # GET /chats/new.json
  def new
    @chat = Chat.new

    render json: @chat
  end

  # POST /chats
  # POST /chats.json
  def create
    @chat = Chat.new(params[:chat])

    if @chat.save
      render json: @chat, status: :created, location: @chat
    else
      render json: @chat.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /chats/1
  # PATCH/PUT /chats/1.json
  def update
    @chat = Chat.find(params[:id])

    if @chat.update_attributes(params[:chat])
      head :no_content
    else
      render json: @chat.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chats/1
  # DELETE /chats/1.json
  def destroy
    @chat = Chat.find(params[:id])
    @chat.destroy

    head :no_content
  end
end
