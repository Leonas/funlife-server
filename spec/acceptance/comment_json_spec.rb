require 'spec_helper'
require 'rspec_to_iodocs/dsl'

resource "Comments" do

  header "Accept", "application/json"
  header "Content-Type", "application/json"

  let!(:setup_comments) do
    @user1 = Factory.create(:user)
    @user2 = Factory.create(:user)
    @comment1 = Factory.create(:comment_on_photo, user: @user1)
    @comment2 = Factory.create(:comment_on_photo, user: @user2, parent: @comment1)
    @comment3 = Factory.create(:comment_on_user, user: @user1, commentable: @user2)
    @comment4 = Factory.create(:comment_on_user, user: @user1, commentable: @user2, parent: @comment3)
  end
  let!(:token) { generate_token(@user1) }

  ######################################
  get "/comments/:id" do ###############
  ######################################

    header "Authorization", :token
    parameter :id, "Comment id", required: true

    let(:id) { @comment1.id }

    example_request "Fetch a comment" do
      explanation "view a single comment"

      response_body.should include_json({
                                            comment: {
                                                id:   @comment1.id,
                                                parent_id: nil,
                                                children_count: 1,
                                                depth: @comment1.depth,
                                                text: @comment1.text,
                                                date: @comment1.created_at.strftime("%b %d,  %I:%M%P"),
                                                user: {
                                                    id: @user1.id,
                                                    name: @user1.name,
                                                    avatar: @user1.avatar
                                                }
                                            }
                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  put "/comments/:id" do ###############
  ######################################

    header "Authorization", :token
    parameter :id, "Comment id", required: true
    parameter :text, "Text", scope: :comment

    let(:id) { @comment1.id }

    let(:text) { "new text" }
    let(:raw_post) { params.to_json }

    example_request "Update a comment" do
      explanation "Update a comment if owner"

      status.should == 204
    end
  end



  ######################################
  delete "/comments/:id" do ############
  ######################################

    header "Authorization", :token
    parameter :id, "Comment id", required: true

    let(:id) { @comment1.id }

    example_request "Delete a comment" do
      explanation "Delete a comment if owned"
      status.should == 204
    end
  end



  ##############################Comments on different Object which should probably be moved into respective areas############


  ######################################
  get "/users/:user_id/comments" do ####
  ######################################

    header "Authorization", :token
    parameter :user_id, "User_id", required: true

    let(:user_id) { @user2.id }

    example_request "Get comments for a user" do
      explanation ""
      response_body.should include_json({

                                            comments: [
                                                    {
                                                        id:        @comment4.id,
                                                        parent_id: @comment4.parent.id,
                                                        depth:     @comment4.depth,
                                                        text:      @comment4.text,
                                                        date:      @comment4.created_at.strftime("%b %d,  %I:%M%P"),
                                                        user:      {
                                                            id:   @user1.id,
                                                            name: @user1.name,
                                                            avatar: @user1.avatar
                                                        }
                                                    },
                                                    {
                                                        id:             @comment3.id,
                                                        children_count: 1,
                                                        depth:          @comment3.depth,
                                                        text:           @comment3.text,
                                                        date:           @comment3.created_at.strftime("%b %d,  %I:%M%P"),
                                                        user:           {
                                                            id:   @user1.id,
                                                            name: @user1.name,
                                                            avatar: @user1.avatar
                                                        },
                                                    }

                                            ]

                                        }.to_json)
      status.should == 200
    end
  end


  ######################################
  post "/users/:user_id/comments" do ###
  ######################################

    header "Authorization", :token
    parameter :user_id, "User_id", required: true
    parameter :parent_id, "Parent post id", scope: :comment
    parameter :text, "Comment text", scope: :comment, required: true

    let(:user_id) { @user2.id }

    let(:parent_id) { @comment3.id }
    let(:text) { "new text" }
    let(:raw_post) { params.to_json }

    example_request "Post a new comment" do
      explanation "Post a new comment on the user's page."
      status.should == 201
    end
  end
end

