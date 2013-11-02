class ConversationsController < ApplicationController
  before_filter :set_conversation, only: [:show, :destroy, :update]


  # GET /conversations
  def index
    @conversations = @current_user.conversations.all
    @conversations.sort_by! { |conversation| conversation.conversation_messages.last.updated_at}.reverse! #this should be updated to make it faster
    render json: @conversations
  end


  # GET /conversations/1
  def show
    #render json: @conversation
    render json: @conversation, root: :conversation, serializer: ConversationMessagesSerializer
  end


  # POST /conversations
  def create
    @user_ids = params[:conversation][:user_ids]
    @user_ids << @current_user.id

    @conversation = @current_user.conversations.build(user_ids: @user_ids)
    @conversation_message = @current_user.conversation_messages.build(user_id: @current_user.id, message: params[:conversation][:message])
    @conversation.conversation_messages << @conversation_message
    @conversation_message.conversation = @conversation

    if @conversation.save
      render json: @conversation, status: :created, location: @conversation
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end
  end


  # DELETE /conversations/1
  def destroy
    #hide instead of destroy the conversations
    #(@current_user.conversation_users.find_by_conversation_id(params[:id])).destroy
    #@conversation.destroy
    head :no_content
  end


  private

  def set_conversation
    @conversation = @current_user.conversations.find(params[:id])
  end
end
