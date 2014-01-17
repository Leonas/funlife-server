require 'spec_helper'

describe Comment do


  it "should have a working factory" do
    expect(Factory.build(:comment_on_photo)).to be_valid
  end

  it "validates present of comment text" do
    expect(Factory.build(:comment_on_photo, text: nil)).to_not be_valid
  end

  it "belongs to a user" do
    expect(Factory.create(:comment_on_photo).user.id).to_not be_nil
  end



  context "a reply to a comment" do

    let! :setup_comments do
      @comment1 = Factory.create(:comment_on_photo)
      @comment2 = Factory.create(:comment_on_photo, parent: @comment1)
      @comment3 = Factory.create(:comment_on_photo, parent: @comment2)
      @comment4 = Factory.create(:comment_on_photo, parent: @comment2)
      @comment5 = Factory.create(:comment_on_photo, parent: @comment4)
    end

    it "has the previous comment as the parent_id" do
      expect(@comment2.parent).to eq(@comment1)
    end

    it "has a count of the number of children replying to it" do
      expect(@comment2.children.count).to eq(2)
    end

    it "comment1 has the correct depth number" do
      expect(@comment1.depth).to eq(0)
    end

    it "comment2 has the correct depth" do
      expect(@comment2.depth).to eq(1)
    end

    it "comment3 has the correct depth" do
      expect(@comment3.depth).to eq(2)
    end

    it "comment4 has the correct depth" do
      expect(@comment4.depth).to eq(2)
    end

    it "comment5 has the correct depth" do
      expect(@comment5.depth).to eq(2)
    end

  end


end
