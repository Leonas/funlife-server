require 'spec_helper'

describe Conversation do
  it { should have_many(:users).through(:conversation_users) }
end
