class ConversationsController < ApplicationController

  #get /conversations
  def index
    @conversations = @current_user.conversations.all
    render json: @conversations, each_serializer: ConversationOverviewSerializer, root: "conversations"
  end



  #get /conversations/1
  def show
    @conversation = @current_user.conversations.find(params[:id])
    render json: @conversation, serializer: ConversationSerializer, root: "conversation"
  end



  #post /conversations
  def create

    @users = params[:conversation][:users]
    @users << current_user.id
    @text  = params[:conversation][:text]

    @conversation = current_user.conversations.build(
        user_ids: @users,
        conversation_messages_attributes: [user: current_user, text: @text],
    )

    @users.each do |user|
      @conversation.conversation_user_joins.build(user_id: user)
    end

    if @conversation.save
      render json: @conversation, serializer: ConversationSerializer, root: "conversation", status: :created
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end
  end



  #post /conversations/:id/
  def create_message
    @conversation = @current_user.conversations.find(params[:id])
    @conversation_message = @conversation.conversation_messages.build(text: params[:text], user: current_user)

    if @conversation_message.save
      render json: @conversation_message, status: :created
    else
      render json: @conversation_message.errors, status: :unprocessable_entity
    end
  end


  #delete /conversations/1
  def destroy
    if current_user.delete_conversation(params[:id])
      head :no_content
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end

  end
end
