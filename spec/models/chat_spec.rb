require 'spec_helper'

describe Chat do
  it { should have_many(:users).through(:user_chats) }
end
