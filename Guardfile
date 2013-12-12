logger level:       :debug

guard :spork do
  watch('config/application.rb')
  watch('config/environment.rb')
  watch('config/environments/test.rb')
  watch(%r{^config/initializers/.+\.rb$})
  watch('Gemfile')
  watch('Gemfile.lock')
  watch('spec/spec_helper.rb') { :rspec }
end

#guard 'process', name: 'dev-server:3000', command: 'rails server', dont_stop: true
#guard 'process', name: 'redis', command: 'redis-server', dont_stop: true
#guard 'process', name: 'iodocs', command: 'npm start', dir: '../funlife-docs'
#guard 'rake',    task: 'generate_iodocs' do watch(%r{^spec/acceptance/(.+)\.rb$}) end


guard :rspec, cmd: "rspec --drb", all_on_start: true, focus_on_failed: false do
  watch(%r{^spec/.+_spec\.rb$})
  watch(%r{^lib/(.+)\.rb$})     { |m| "spec/lib/#{m[1]}_spec.rb" }
  watch('spec/spec_helper.rb')  { "spec" }

  watch(%r{^app/(.+)\.rb$})                           { |m| "spec/#{m[1]}_spec.rb" }
  watch(%r{^app/controllers/(.+)_(controller)\.rb$})  { |m| ["spec/routing/#{m[1]}_routing_spec.rb", "spec/#{m[2]}s/#{m[1]}_#{m[2]}_spec.rb", "spec/acceptance/#{m[1]}_spec.rb"] }
  watch(%r{^spec/acceptance/(.+)_(spec)\.rb$})        { |m| "spec/acceptance/#{m[1]}_spec.rb" }
  watch(%r{^spec/support/(.+)\.rb$})                  { "spec" }
  watch('config/routes.rb')                           { "spec/routing" }
  watch('app/controllers/application_controller.rb')  { "spec/controllers" }

end




#guard 'brakeman', :run_on_start => true do
#  watch(%r{^app/.+\.(erb|haml|rhtml|rb)$})
#  watch(%r{^config/.+\.rb$})
#  watch(%r{^lib/.+\.rb$})
#  watch('Gemfile')
#end
