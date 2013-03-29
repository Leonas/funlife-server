class CommentsController < ApplicationController
  before_filter :set_photo
  before_filter :set_comment, only: [:show, :update, :destroy]

  # GET /photos/:photo_id/comments
  def index
    @comments = @photo.comments
    render json: @comments
  end

  # GET /comments/1
  # GET /comments/1.json
  def show
    render json: @comment
  end

  # POST /comments
  # POST /comments.json
  def create
    @comment = @photo.comments.build(comment_params)
    if @comment.save
      render json: @comment, status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  # PATCH/PUT /comments/1.json
  def update
    if @comment.update_attributes(params[:comment])
      head :no_content
    else
      render json: {errors: @comment.errors}, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  # DELETE /comments/1.json
  def destroy
    @comment.destroy
    head :no_content
  end

  private

  def comment_params
    params[:comment].merge({user_id: @current_user.id})
  end

  def set_photo
    @photo = Photo.find(params[:photo_id])
  end

  def set_comment
    @comment = @photo.comments.find(params[:id])
  end
end
