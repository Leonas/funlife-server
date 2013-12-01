require 'spec_helper'
require 'faker'

describe User do

  let(:user1) { Factory.create(:user) }
  subject { user1 }

  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email) }

  it { should_not allow_mass_assignment_of(:token) }
  it { should_not allow_mass_assignment_of(:password_digest) }

  it { should respond_to(:name) }
  it { should respond_to(:full_name) }

  its(:name) { should == user1.name }

  it "allows valid emails" do
    addresses = %w[user@foo.COM A_US-ER@f.b.org frst.lst@foo.jp a+b@baz.cn]
    addresses.each do |valid_address|
      allow_value(valid_address).for(:email)
    end
  end


  it "should ensure authentication_token assigns token before save" do
    user1.token.should_not be_empty
  end

  it "should reset authentication token" do
    user1.reset_authentication_token
    user1.token_changed?.should be true
  end

  it "should successfully perform reset_authentication_token!" do
    user1.reset_authentication_token!
    expect(user1.token).to be_nil
  end



    describe "email address with mixed case" do
      let(:mixed_case_email) { "Foo@ExAMPle.CoM" }

      it "should be saved as all lower-case" do
        user1.email = mixed_case_email
        user1.save
        user1.reload.email.should == mixed_case_email.downcase
      end
    end

    describe "when password is not present" do
      before { user1.password = " " }
      it { should_not be_valid }
    end

    describe "with a password that's too short" do
      before { user1.password = "a" * 5 }
      it { should be_invalid }
    end


    describe "photo associations" do

      before { user1.save }
      let!(:older_photo) do
        FactoryGirl.create(:photo, user: user1, created_at: 1.day.ago)
      end
      let!(:newer_photo) do
        FactoryGirl.create(:photo, user: user1, created_at: 1.hour.ago)
      end

      it "should have the right photos in the right order" do
        user1.photos.should == [newer_photo, older_photo]
      end

      it "should destroy associated photos" do
        photos = user1.photos.dup
        user1.destroy
        photos.should_not be_empty
        photos.each do |photo|
          Photo.find_by_id(photo.id).should be_nil
        end
      end
    end

    describe "following" do
      let(:other_user) { FactoryGirl.create(:user) }
      before do
        user1.save
        user1.follow!(other_user)
      end

      it { should be_following(other_user) }
      its(:followed_users) { should include(other_user) }

      describe "followed user" do
        subject { other_user }
        its(:followers) { should include(user1) }
      end

      describe "and unfollowing" do
        before { user1.unfollow!(other_user) }

        it { should_not be_following(other_user) }
        its(:followed_users) { should_not include(other_user) }
      end
    end
end



