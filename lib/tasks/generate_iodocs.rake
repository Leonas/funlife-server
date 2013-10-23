#generates the iodocs file AND duplicates the file to the logged in api name
task :generate_iodocs => 'docs:generate' do
  cp '../funlife-iodocs/public/data/funlife.json', '../funlife-iodocs/public/data/funlife-logged-in.json'
end