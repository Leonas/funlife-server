class UserSelfSerializer < ActiveModel::Serializer
  attributes :id,
             :email,
             :token,
             :first_name,
             :last_name,
             :name,
             :gender,
             :birthday,
             :avatar,
             :cover_photo,
             :following_count,
             :followers_count,
             :completed_profile



  has_many :photos, each_serializer: PhotoSerializer
  has_many :followers, each_serializer: UserMiniSerializer
  has_many :following, each_serializer: UserMiniSerializer

  has_many :conversations, each_serializer: ConversationInboxSerializer
  has_many :events_attending, each_serializer: EventSerializer
  has_many :event_invitations, each_serializer: InvitationSerializer
  has_many :comments, each_serializer: CommentSerializer



end
