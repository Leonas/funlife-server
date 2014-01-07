#Custom rake tasks have a .rake extension and are placed in Rails.root/lib/tasks.


#desc "I am short, but comprehensive description for my cool task"
#task task_name: [:prerequisite_task, :another_task_we_depend_on] do
#  # All your magic here
#  # Any valid Ruby code is allowed
#end


#To pass arguments to your custom rake task:


#task :task_name, [:arg_1] => [:pre_1, :pre_2] do | t, args |
## You can use args from here
#end


#You can group tasks by placing them in namespaces :
#
#    namespace :db do
#      desc "This task does nothing"
#      task :nothing do
#        # Seriously, nothing
#      end
#    end