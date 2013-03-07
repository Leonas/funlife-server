require 'spec_helper'

describe User do

  xit { should validate_presence_of(:first_name) }
  xit { should validate_presence_of(:last_name) }

  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:email) }

  xit { should_not allow_value('noregex').for(:email) }

  it { should allow_value('a@b.com').for(:email) }
  it { should_not allow_mass_assignment_of(:token) }
  it { should_not allow_mass_assignment_of(:password_digest) }

  xit { should ensure_inclusion_of(:age).in_range(13..120) }

end