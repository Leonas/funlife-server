require 'spec_helper'

describe Invitation do
  it { should belong_to(:event) }
end
