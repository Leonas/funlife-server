class CommentsController < ApplicationController



  #get /object/:object_id/comments
  def index
    @object = get_object
    @comments = @object.comments
    render json: @comments, each_serializer: CommentSerializer, root: "comments"
  end



  #get /comments/1
  def show
    @comment = Comment.find(params[:id])
    render json: @comment, serializer: CommentSerializer, root: "comment"
  end



  #post /object/object_id/comments
  def create
    @object = get_object

    @comment = @object.comments.build(text: comment_params[:text])
    @comment.parent = Comment.find(comment_params[:parent_id]) if comment_params[:parent_id]
    @comment.user = current_user
    if @comment.save
      render json: @comment, status: :created, serializer: CommentSerializer, root: "comment"
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end



  #patch /comments/1
  def update
    @comment = Comment.find(params[:id])
    if @comment.update_attributes(text: params[:comment][:text])
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
        :text,
        :parent_id
    )
  end

  def get_object
    if params[:place_id]
      Place.find(params[:place_id])
    elsif params[:photo_id]
      Photo.find(params[:photo_id])
    elsif params[:user_id]
      User.find(params[:user_id])
    end
  end

end
