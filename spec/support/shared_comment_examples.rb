shared_examples "GET /resource/:id/comments" do

    header "Authorization", :token
    parameter :id, "#{@resource.class.to_s.downcase} id", required: true

    let(:id) { @resource.id }

    example_request "Get comments" do
      explanation "Get all comments for #{@resource.class.to_s.downcase}"
      response_body.should be_json_eql({
                                            comments: SharedJSON.comments(@comments)
                                        }.to_json)
      status.should == 200
    end
end


shared_examples "POST /resource/:id/comments" do

  header "Authorization", :token
  parameter :id,        "#{@resource.class.to_s.downcase} id",            required: true
  parameter :parent_id, "Reply to comment id", scope: :comment
  parameter :text,      "Comment text",        scope: :comment, required: true

  let(:id) { @resource.id }
  let(:text) { "I'm excited to attend!" }
  let(:raw_post) { params.to_json }

  example_request "Post a comment" do
    explanation "Post a comment on the current #{@resource.class.to_s.downcase}"
    status.should == 201
  end

end


  #
  #
  #################################################
  #post "/#{@path}/:id/comments" do ###############
  #################################################
  #
  #  header "Authorization", :token
  #  parameter :id, "#{@path.capitalize} id", required: true
  #
  #  example_request "New comment #{@path}" do
  #    explanation "Toggles between like/unlike"
  #    response_body.should be_json_eql({
  #
  #                                      }.to_json)
  #    status.should == 200
  #  end
  #end
  #
  #
  #
  ###############################################
  #put "/#{@path}/:id/comments/:comment_id" do ##
  ###############################################
  #
  #  header "Authorization", :token
  #  parameter :id, "#{@path.capitalize} id", required: true
  #  parameter :comment_id, "comment id", required: true
  #
  #  example_request "New comment #{@path}" do
  #    explanation "Toggles between like/unlike"
  #    response_body.should be_json_eql({
  #
  #                                      }.to_json)
  #    status.should == 200
  #  end
  #end
  #
  #
  #
  #################################################
  #delete "/#{@path}/:id/comments/:comment_id" do #
  #################################################
  #
  #  header "Authorization", :token
  #  parameter :id, "#{@path.capitalize} id", required: true
  #  parameter :comment_id, "comment id", required: true
  #
  #  example_request "New comment #{@path}" do
  #    explanation "Toggles between like/unlike"
  #    response_body.should be_json_eql({
  #
  #                                      }.to_json)
  #    status.should == 200
  #  end
  #end



