module SharedJSON

  ############################################################
  # Common JSON output used for has_one and has_many relations
  ############################################################


  def self.comment(comment)
    if comment
      {
          id:        comment.id,
          parent_id: comment.parent_id,
          children_count: comment.children_count,
          depth:     comment.depth,
          text:      comment.text,
          date:      comment.created_at.strftime("%b %d,  %I:%M%P"),
          user:      self.user(comment.user)
      }
    else
      {}
    end
  end



  def self.user(user)
    if user
      {
          id:     user.id,
          name:   user.name,
          avatar: user.avatar
      }
    else
      {}
    end
  end



  def self.activity(activity)
    if activity
      {
          id:       activity.id,
          name:     activity.name,
          icon_url: activity.icon_url
      }
    else
      {}
    end
  end


  def self.photo(photo, current_user)
    if photo
      {
          id:    photo.id,
          url:   photo.url,
          date:  photo.updated_at.strftime("%b %d,  %I:%M%P"),
          like_count: photo.like_count,
          liked: false #photo.current_user
      }
    else
      {}
    end
  end


  def self.conversation_message(message)
    if message
      {
          id:    @conversation4.id,
          newest_message: @conversation4.conversation_messages.last.text,
          date:  @conversation4.updated_at.strftime("%b %d,  %I:%M%P"),
          users: [
                     {
                         id:     @user3.id,
                         name:   @user3.name,
                         avatar: @user3.avatar
                     },
                     {
                         id:     @user1.id,
                         name:   @user1.name,
                         avatar: @user1.avatar
                     }
                 ]
      }
    else
      {}
    end
  end





  # Plurals that return an array

  def self.comments(comment_array = [])
    comments = []
    comment_array.each { |a_comment| comments << comment(a_comment) }
    comments
  end

  def self.users(user_array = [])
    users = []
    user_array.each { |a_user| users << user(a_user) }
    users
  end

  def self.favorited_by(user_array = [])
    users = []
    user_array.each { |a_user| users << user(a_user) }
    users
  end

  def self.conversation_messages(message_array = [])
    messages = []
    message_array.each { |a_message| messages << message(a_message) }
    messages
  end

  def self.activities(activity_array = [])
    activities = []
    activity_array.each { |a_activity| activities << activity(a_activity) }
    activities
  end

  def self.photos(photo_array = [], current_user)
    photos = []
    photo_array.each { |a_photo| photos << photo(a_photo, current_user) }
    photos
  end



end