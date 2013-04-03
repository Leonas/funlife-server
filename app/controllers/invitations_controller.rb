class InvitationsController < ApplicationController

  def create
    @activity = @current_user.activities.find(params[:activity_id])
    @activity.guest_ids << params[:invitation][:user_ids]
    head :no_content
  end
end
