class ChatMessagesController < ApplicationController
  # GET /chat_messages
  # GET /chat_messages.json
  def index
    @chat_messages = ChatMessage.all

    render json: @chat_messages
  end

  # GET /chat_messages/1
  # GET /chat_messages/1.json
  def show
    @chat_message = ChatMessage.find(params[:id])

    render json: @chat_message
  end

  # GET /chat_messages/new
  # GET /chat_messages/new.json
  def new
    @chat_message = ChatMessage.new

    render json: @chat_message
  end

  # POST /chat_messages
  # POST /chat_messages.json
  def create
    @chat_message = ChatMessage.new(params[:chat_message])

    if @chat_message.save
      render json: @chat_message, status: :created, location: @chat_message
    else
      render json: @chat_message.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /chat_messages/1
  # PATCH/PUT /chat_messages/1.json
  def update
    @chat_message = ChatMessage.find(params[:id])

    if @chat_message.update_attributes(params[:chat_message])
      head :no_content
    else
      render json: @chat_message.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_messages/1
  # DELETE /chat_messages/1.json
  def destroy
    @chat_message = ChatMessage.find(params[:id])
    @chat_message.destroy

    head :no_content
  end
end
