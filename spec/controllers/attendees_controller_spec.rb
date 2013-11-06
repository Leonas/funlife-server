#require "spec_helper"
#
#describe AttendeesController do
#  before do
#    login_user
#  end
#
#  describe "GET to #index" do
#    before do
#      @event = Factory.create(:public_event)
#      @event.users << @current_user
#      get :index, event_id: @event.id
#    end
#
#    xit{ should assign_to(:event) }
#    xit{ should assign_to(:users) }
#    it { should respond_with(:success) }
#  end
#
#  describe "POST to #join" do
#    it "should create a new atteende" do
#      expect{
#        public_event = Factory.create(:public_event)
#        post :create, event_id: public_event.id
#      }.to change(Attendee, :count).by(1)
#    end
#
#    it "respond with error if pass invalid attrs" do
#      public_event = Factory.create(:event)
#      post :create, event_id: public_event.id
#      should respond_with(:unprocessable_entity)
#    end
#  end
#end
