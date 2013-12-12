class CommentsController < ApplicationController

  # GET /photos/:photo_id/comments
  def index
    @comments = Comment.all     #todo this is wrong
    render json: @comments
  end

  # GET /comments/1
  def show
    @comment = Comment.find(params[:id])
    render json: @comment
  end

  # POST /comments
  def create
    @comment = Comment.build(comment_params)
    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  def update
    @comment = Comment.find(params[:id])
    if @comment.update_attributes(params[:comment])
      head :no_content
    else
      render json: {errors: @comment.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy
    head :no_content
  end

  private

  def comment_params                       #this stuff is highly questionable
    params[:comment].merge({user_id: @current_user.id})
    params.require(:comment).permit(
        :commentable_id,
        :commentable_type,
        :body,
        :user_id,
        :parent_id
    )
  end

end
