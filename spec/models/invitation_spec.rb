require 'spec_helper'

describe Invitation do
  it { should belong_to(:activity) }
end
