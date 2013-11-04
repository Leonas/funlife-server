class InvitationsController < ApplicationController

  def create
    @event = @current_user.events.find(params[:activity_id])
    @event.guest_ids << params[:invitation][:user_ids]
    head :no_content
  end
end
