class ConversationsController < ApplicationController
  before_filter :set_conversation, only: [:show, :destroy]


  # GET /conversations
  def index
    @conversations = @current_user.conversations.all
    @conversations.sort_by! { |conversation| conversation.conversation_messages.last.updated_at}.reverse! #this should be updated to make it faster
    render json: @conversations
  end


  # GET /conversations/1
  def show
    render json: @conversation, root: :conversation, serializer: ConversationMessagesSerializer
  end


  # POST /conversations
  def create
    #add all users including current users to conversation users
    @user_ids = params[:conversation][:user_ids]
    #@user_ids << @current_user.id

    @conversation = current_user.conversations.build(user_ids: @user_ids,
                                       conversation_messages_attributes: [body: params[:conversation][:message]])

    if @conversation.save
      render json: @conversation, status: :created, location: @conversation
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end
  end


  # DELETE /conversations/1
  def destroy
    #hide instead of destroy the conversations
    #(@current_user.conversation_user_joins.find_by_conversation_id(params[:id])).destroy
    #@conversation.destroy
    head :no_content
  end


  private

  def set_conversation
    @conversation = @current_user.conversations.find(params[:id])
  end
end
