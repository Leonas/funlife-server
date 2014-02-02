module JSONOutput

  ############################################################
  # The JSON outputs serializers should generate
  ############################################################



  def self.user_mini(input)
    input = setup_variables(input)
    generate_output({

                      id:      input[:user].id,
                      name:     input[:user].name,
                      avatar:   input[:user].avatar,
                      followed: input[:user].followed

    }, input)
  end


  def self.user(input)
    input = setup_variables(input)
      generate_output({

                        id:              input[:user].id,
                        name:            input[:user].name,
                        avatar:          input[:user].avatar,
                        cover_photo:     input[:user].cover_photo,
                        following:       input[:user].following,
                        followers:       input[:user].followers,
                        following_count: input[:user].following_count,
                        followers_count: input[:user].followers_count,
                        photos:          photos(input[:photos]),
                        comments:        comments(input[:comments])

      }, input)
    end


  def self.user_self(input)
      input = setup_variables(input)
      generate_output({

                        id:                input[:user].id,
                        email:             input[:user].email,
                        token:             input[:user].token,
                        first_name:        input[:user].first_name,
                        last_name:         input[:user].last_name,
                        name:              input[:user].name,
                        gender:            input[:user].gender,
                        birthday:          input[:user].birthday,
                        avatar:            input[:user].avatar,
                        cover_photo:       input[:user].cover_photo,
                        following_count:   input[:user].following_count,
                        followers_count:   input[:user].followers_count,
                        completed_profile: input[:user].completed_profile,
                        photos:            photos(input[:photos]),
                        followers:         users_mini(input[:followers]),
                        following:         users_mini(input[:following]),
                        conversations:     conversations_inbox(input[:conversations]),
                        events_attending:  events(input[:events_attending]),
                        event_invitations: events(input[:event_invitations]),
                        comments:          comments(input[:comments])

      }, input)
  end

    
    

  def self.conversation_inbox(input)
    input = setup_variables(input)
    generate_output({

                        id:             input[:conversation].id,
                        newest_message: input[:conversation].newest_message,
                        date:           input[:conversation].date,
                        users:          users_mini(input[:users])

    }, input)
  end



  def self.conversation(input)
    input = setup_variables(input)
    generate_output({

                      id:                    input[:conversation].id,
                      users:                 users(input[:users]),
                      conversation_messages: conversation_messages(input[:conversation_messages])

    }, input)
  end


  def self.conversation_message(input)
    input = setup_variables(input)
    generate_output({

                      id:   input[:message].id,
                      date: input[:message].date,
                      text: input[:message].text,
                      user: user(input[:user])

    }, input)
  end



  def self.comment(input)
    input = setup_variables(input)
    generate_output({

                      id:        input[:comment].id,
                      parent_id: input[:comment].parent_id,
                      children:  input[:comment].children_count,
                      depth:     input[:comment].depth,
                      text:      input[:comment].text,
                      date:      input[:comment].created_at.strftime("%b %d,  %I:%M%P"),
                      user:      user(input[:created_by])

    }, input)
  end



  def self.activity(input)
    input = setup_variables(input)
    generate_output({

                      id:       input[:activity].id,
                      name:     input[:activity].name,
                      icon_url: input[:activity].icon_url

    }, input)
  end



  def self.photo(input)
    input = setup_variables(input)
    generate_output({

                      id:         input[:photo].id,
                      url:        input[:photo].url,
                      date:       input[:photo].updated_at.strftime("%b %d,  %I:%M%P"),
                      like_count: input[:photo].like_count,
                      liked:      input[:votes].liked

    }, input)
  end



   def self.place(input)
     input = setup_variables(input)
     generate_output({

                       id:             input[:place].id,
                       name:           input[:place].name,
                       street_address: input[:place].street_address,
                       zip_code:       input[:place].zip_code,
                       city:           input[:place].city,
                       longitude:      input[:place].longitude,
                       latitude:       input[:place].latitude,
                       time_open:      input[:place].time_open,
                       time_close:     input[:place].time_close,
                       phone:          input[:place].phone,
                       description:    input[:place].description,
                       liked_by:       users(input[:liked_by]),
                       activities:     activities(input[:activities]),
                       photos:         photos(input[:photos]),
                       comments:       comments(input[:comments])

     }, input)
   end
    
    
    def self.place_mini(input)
      input = setup_variables(input)
     generate_output({

                       id:             input[:place].id,
                       name:           input[:place].name,
                       street_address: input[:place].street_address,
                       zip_code:       input[:place].zip_code,
                       city:           input[:place].city,
                       longitude:      input[:place].longitude,
                       latitude:       input[:place].latitude,
                       time_open:      input[:place].time_open,
                       time_close:     input[:place].time_close,
                       phone:          input[:place].phone,
                       description:    input[:place].description,
                       liked_by:       users(input[:liked_by]),
                       activities:     activities(input[:activities]),
                       photos:         photos(input[:photos]),

     }, input)
   end



  def self.event(input)
    input = setup_variables(input)
    generate_output({

                      id:            input[:event].id,
                      title:         input[:event].title,
                      details:       input[:event].details,
                      start_time:    input[:event].start_time.strftime("%b %d,  %I:%M%P"),
                      end_time:      input[:event].end_time.strftime("%b %d,  %I:%M%P"),
                      duration:      input[:event].duration.strftime("%b %d,  %I:%M%P"),
                      cover_photo:   input[:event].cover_photo,
                      location:      {
                        street_address: input[:event].street_address,
                        zip_code:       input[:event].zip_code,
                        city:           input[:event].city,
                        state:          input[:event].state,
                        longitude:      input[:event].longitude,
                        latitude:       input[:event].latitude
                      },
                      activities:    activities(input[:activities]),
                      photos:        photos(input(:photos)),
                      admins:        users(input[:admins]),
                      invited:       users(input[:invited]),
                      attending:     users(input[:attending]),
                      not_attending: users(input[:not_attending]),
                      comments:      comments(input[:comments])

      }, input)
  end


    
  def self.invitation(input)
    input = setup_variables(input)
  generate_output({

                    id:         input[:event].id,
                    invited_by: user(input[:invitation]),
                    message:    input[:invitation].message,
                    event:      event(input[:event])


    }, input)
end









########Plurals


  def self.users_mini(user_array = [])
    user_array.map! { |a_user| user_mini(a_user) }
  end



  def self.users(user_array = [])
    user_array.map! { |a_user| user(a_user) } 
  end


  def self.users_self(user_array = [])
    user_array.map! { |a_user| user_self(a_user) } 
  end


  def self.conversations_inbox(conversations_array = [])
    conversations_array.map! { |a_conversation| conversation_inbox(a_conversation) }
  end

  def self.comments(comment_array = [])
    comment_array.map! { |a_comment| comment(a_comment) }
  end


  def self.conversation_messages(message_array = [])
    message_array.map! { |a_message| message(a_message) }
  end

  def self.activities(activity_array = [])
    activity_array.map! { |a_activity| activity(a_activity) } 
  end

  def self.photos(photo_array = [])
    photo_array.map! { |a_photo| photo(a_photo) }
  end

  def self.places(place_array = [])
    place_array.map! { |a_place| place(a_place) }
  end

  def self.events(event_array = [])
    event_array.map! { |an_event| event(an_event) }
  end


  def self.setup_variables(input)

    if input


      @@user       ||= input[:user]
      input[:user] ||= @@user

      input[:conversations] ||= input[:user].conversations


      input[:followers] ||= input[:user].followers
      input[:following] ||= input[:user].following

      input[:activities] ||= input[:place].activities if input[:place]
      input[:activities] ||= input[:event].activities if input[:event]

      input[:photos] ||= input[:user].photos
      input[:photos] ||= input[:place].photos if input[:place]
      input[:photos] ||= input[:event].photos if input[:event]

      input[:liked_by] ||= input[:place].liked_by if input[:place]

      input[:comments] ||= input[:place].comments if input[:place]
      input[:comments] ||= input[:event].comments if input[:event]
      input[:comments] ||= input[:user].comments
      input[:comments] ||= input[:photo].comments if input[:photo]


      input[:events]        ||= input[:user].events
      input[:admins]        ||= input[:event].admins if input[:event]
      input[:invited]       ||= input[:event].invited if input[:event]
      input[:attending]     ||= input[:event].attending if input[:event]
      input[:not_attending] ||= input[:event].not_attending if input[:event]

      input[:events_attending] ||= input[:user].events_attending
      input[:event_invitations] ||= input[:user].event_invitations
      input
    else
      nil
    end
  end

  def self.generate_output(output_format, input)
    if input
      output_format
    else
      {}
    end
  end


end