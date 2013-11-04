#require 'spec_helper'
#
#describe InvitationsController do
#  before do
#    login_user
#  end
#
#  describe "POST to #create" do
#    it "should create a new invitations" do
#      event = Factory.create(:event, user_id: @current_user.id)
#      users = []
#      expect{
#        3.times{ users << Factory.create(:user).id }
#        post :create, event_id: event.id,  invitation: { user_ids: users }
#      }.to change(Invitation, :count).by(users.size)
#    end
#  end
#end
