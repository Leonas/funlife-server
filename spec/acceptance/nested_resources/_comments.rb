module Comments

  ################################################
  get "/#{@path}/:id/comments" do ################
  ################################################


    example_request "Get comments" do
      explanation "Get all comments for #{@path}"
      response_body.should include_json({

                                        }.to_json)
      status.should == 200
    end
  end



  ################################################
  post "/#{@path}/:id/comments" do ###############
  ################################################

    header "Authorization", :token
    parameter :id, "#{@path.capitalize} id", required: true

    example_request "New comment #{@path}" do
      explanation "Toggles between like/unlike"
      response_body.should include_json({

                                        }.to_json)
      status.should == 200
    end
  end



  ##############################################
  put "/#{@path}/:id/comments/:comment_id" do ##
  ##############################################

    header "Authorization", :token
    parameter :id, "#{@path.capitalize} id", required: true
    parameter :comment_id, "comment id", required: true

    example_request "New comment #{@path}" do
      explanation "Toggles between like/unlike"
      response_body.should include_json({

                                        }.to_json)
      status.should == 200
    end
  end



  ################################################
  delete "/#{@path}/:id/comments/:comment_id" do #
  ################################################

    header "Authorization", :token
    parameter :id, "#{@path.capitalize} id", required: true
    parameter :comment_id, "comment id", required: true

    example_request "New comment #{@path}" do
      explanation "Toggles between like/unlike"
      response_body.should include_json({

                                        }.to_json)
      status.should == 200
    end
  end



end