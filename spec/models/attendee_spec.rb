require 'spec_helper'

describe Attendee do
  it { should belong_to(:user) }
  it { should belong_to(:activity) }
end
