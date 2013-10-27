class ConversationsController < ApplicationController
  before_filter :set_conversation, only: [:show, :destroy, :update]
  # GET /conversations
  # GET /conversations.json
  def index
    @conversations = @current_user.conversations
    render json: @conversations
  end

  # GET /conversations/1
  # GET /conversations/1.json
  def show
    render json: @conversation
  end

  # POST /conversations
  # POST /conversations.json
  def create
    @conversation = @current_user.conversations.build(params[:conversation])
    if @conversation.save
      #FIXME save should assign the current_user
      @conversation.users << @current_user
      render json: @conversation, status: :created, location: @conversation
    else
      render json: @conversation.errors, status: :unprocessable_entity
    end
  end

  # DELETE /conversations/1
  # DELETE /conversations/1.json
  def destroy
    @conversation.destroy
    head :no_content
  end

  private

  def set_conversation
    @conversation = @current_user.conversations.find(params[:id])
  end
end
