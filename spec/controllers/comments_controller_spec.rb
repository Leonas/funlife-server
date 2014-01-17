require 'spec_helper'

describe CommentsController do
  before do
    login_user
  end

  let(:photo) { Factory.create(:photo, user: @current_user) }

  describe "GET to #index of photo comments" do
    before do
      get :index, photo_id: photo.id
    end

    it { should respond_with(:success) }
  end

  describe "GET to #show" do
    before do
      comment = Factory.create(:comment_on_photo)
      get :show, id: comment.id
    end


    it { should respond_with(:success) }
  end

  describe "POST to #create" do
    def comment_attrs
      comment = Factory.attributes_for(:comment_on_photo)
      comment.delete(:commentable)
      comment.delete(:user)
      comment
    end

    it "should create a new comment" do
      expect{
        post :create, photo_id: photo.id, comment: comment_attrs
      }.to change(Comment, :count).by(1)
    end

    it "respond with error if pass invalid attrs" do
      post :create, photo_id: photo.id, comment: {bad: "stuff"}
      should respond_with(:unprocessable_entity)
    end

    it "respond with success if pass valid attrs" do
      post :create, photo_id: photo.id, comment: comment_attrs
      should respond_with(:created)
    end
  end

  describe "PUT to #update" do
    before do
      @comment = Factory.create(:comment_on_photo)
    end
    it "should update the user" do
      put :update, photo_id: photo.id, id: @comment.id, comment: { text: "Hey Hey"}
      should respond_with(:no_content)
    end

    it "should not update the comment with invalid params" do
      put :update, photo_id: photo.id, id: @comment.id, comment: { text: "" }
      should respond_with(:unprocessable_entity)
    end
  end

  describe "DELETE to #destroy" do
    before do
      @comment = Factory.create(:comment_on_photo, commentable: photo)
    end

    it "should delete a comment" do
      expect{
        delete :destroy, photo_id: photo.id, id: @comment.id
      }.to change(Comment, :count).by(-1)
    end

    it "should respond with no content" do
      delete :destroy, photo_id: photo.id, id: @comment.id
      should respond_with :no_content
    end
  end
end
