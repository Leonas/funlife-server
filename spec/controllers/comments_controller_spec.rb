#require 'spec_helper'
#
#describe CommentsController do
#  before do
#    login_user
#  end
#
#  let(:photo) { Factory.create(:photo, user_id: @current_user.id) }
#
#  describe "GET to #index" do
#    before do
#      get :index, photo_id: photo.id
#    end
#
#    xit{ should assign_to(:photo) }
#    xit{ should assign_to(:comments) }
#    it { should respond_with(:success) }
#  end
#
#  describe "GET to #show" do
#    before do
#      comment = Factory.create(:comment, photo_id: photo.id)
#      get :show, photo_id: photo.id, id: comment.id
#    end
#
#    xit{ should assign_to(:photo) }
#    xit{ should assign_to(:comment) }
#    it { should respond_with(:success) }
#  end
#
#  describe "POST to #create" do
#    def comment_attrs
#      h = Factory.attributes_for(:comment)
#      h.delete(:photo)
#      h.delete(:user)
#      h
#    end
#
#    it "should create a new comment" do
#      expect{
#        post :create, photo_id: photo.id, comment: comment_attrs
#      }.to change(Comment, :count).by(1)
#    end
#
#    it "respond with error if pass invalid attrs" do
#      post :create, photo_id: photo.id, comment: {}
#      should respond_with(:unprocessable_entity)
#    end
#
#    it "respond with successf if pass valid attrs" do
#      post :create, photo_id: photo.id, comment: comment_attrs
#      should respond_with(:created)
#    end
#  end
#
#  describe "PUT to #update" do
#    before do
#      @comment = Factory.create(:comment, photo_id: photo.id)
#    end
#    it "should update the user" do
#      put :update, photo_id: photo.id, id: @comment.id, comment: { body: "Hey Hey"}
#      should respond_with(:no_content)
#    end
#
#    it "shoudl no update the user with invalid params" do
#      put :update, photo_id: photo.id, id: @comment.id, comment: { body: "" }
#      should respond_with(:unprocessable_entity)
#    end
#  end
#
#  describe "DELETE to #destroy" do
#    before do
#      @comment = Factory.create(:comment, photo_id: photo.id)
#    end
#
#    it "should delete a comment" do
#      expect{
#        delete :destroy, photo_id: photo.id, id: @comment.id
#      }.to change(Comment, :count).by(-1)
#    end
#
#    it "should respond with no content" do
#      delete :destroy, photo_id: photo.id, id: @comment.id
#      should respond_with :no_content
#    end
#  end
#end
