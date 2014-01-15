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



  #post /comments
  def create
    @object = get_object
    @comment = @object.comments.create(comment_params)
    if @comment.save
      render json: @comment, status: :created, serializer: CommentSerializer, root: "comment"
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
        :text,
        :parent_id
    )
  end

  def get_object
    if params[:place_id]
      Place.find(params[:place_id])
    elsif params[:photo_id]
      Photo.find(params[:photo_id])
    end
  end

end
