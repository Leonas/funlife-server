class ChatMessagesController < ApplicationController
  before_filter :set_chat

  # GET /chats/:chat_id/chat_messages
  # GET /chats/:chat_id/chat_messages.json
  def index
    @chat_messages = @chat.chat_messages
    render json: @chat_messages
  end

  # POST /chats/:chat_id/chat_messages
  def create
    @chat_message = @chat.chat_messages.build(chat_params)
    if @chat_message.save
      render json: @chat_message, status: :created
    else
      render json: @chat_message.errors, status: :unprocessable_entity
    end
  end

  private

  def set_chat
    @chat = @current_user.chats.find(params[:chat_id])
  end

  def chat_params
    params[:chat_message].merge({user_id: @current_user.id})
  end
end
