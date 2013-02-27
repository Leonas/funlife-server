#require 'spec_helper'
#
#describe 'javascript posts and gets for the user controller' do
#  before :each do
#    create_3_users  #defines @user1-3
#    log_in(@user1)
#  end
#
#
#  it 'posts some shit and gets some shit' do
#
#    result = page.evaluate_script("$.post(server+'login',$('#login_form').serialize(), function(callback){
#                console.log('login attempted. callback & callback.token below:');
#                console.log(callback);
#                console.log(callback.token);
#                })")
#    puts result
#  end
#
#
#end