class ConversationMessagesController < ApplicationController
  before_filter :set_conversation

  # GET /conversations/:conversation_id/conversation_messages
  # GET /conversations/:conversation_id/conversation_messages.json
  def index
    @conversation_messages = @conversation.conversation_messages.since(params[:latest_timestamp])
    render json: @conversation_messages
  end

  # POST /conversations/:conversation_id/conversation_messages
  def create
    @conversation_message = @conversation.conversation_messages.build(conversation_params)
    if @conversation_message.save
      render json: @conversation_message, status: :created
    else
      render json: @conversation_message.errors, status: :unprocessable_entity
    end
  end

  private

  def set_conversation
    @conversation = @current_user.conversations.find(params[:conversation_id])
  end

  def conversation_params
    params[:conversation_message].merge({user_id: @current_user.id})
  end
end
