CLOUDINARY = YAML.load(File.read(File.expand_path('../../cloudinary.yml', __FILE__)))
CLOUDINARY.symbolize_keys!