module Likes


  ######################################
  post "/#{@path}/:id/like" do ###########
    ######################################

    header "Authorization", :token
    parameter :id, "#{@path.capitalize} id", required: true

    example_request "Like or unlike a #{@path}" do
      explanation "Toggles between like/unlike"
      status.should == 200
    end
  end

end