shared_examples "POST /resource/:id/toggle_like" do

  header "Authorization", :token
  parameter :id, "#{@resource.class.to_s.downcase} id", required: true

  let(:id) { @resource.id }

  example_request "Like or unlike a #{@resource.class.to_s.downcase}" do
    explanation "Toggles between like/unlike"

    if status == 201
      status.should == 201
    else
      status.should == 204
    end

  end

end


