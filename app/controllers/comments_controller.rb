class CommentsController < ApplicationController

  #get /object/:object_id/comments
  def index
    @comments = Comment.where(commentable_id, params[:commentable_id])
    render json: @comments
  end

  #get /comments/1
  def show
    @comment = Comment.find(params[:id])
    render json: @comment
  end

  #post /comments
  def create
    #@post = Post.find(params[:post_id])
    #@comment = @post.comments.create(params[:comment])
    @comment = current_user.comments.build(comment_params)
    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  #patch /comments/1
  def update
    @comment = Comment.find(params[:id])
    if @comment.update_attributes(comment_params)
      head :no_content
    else
      render json: {errors: @comment.errors}, status: :unprocessable_entity
    end
  end

  #delete /comments/1
  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy
    head :no_content
  end

  private

  def comment_params
    params.require(:comment).permit(
        :commentable_id,
        :commentable_type,
        :text,
        :user_id,
        :parent_id
    )
  end

end
