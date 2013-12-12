#stuff gets autoloaded from this folder. heres an example of a custom validator:

#class Person < ActiveRecord::Base
#  validates_with GoodnessValidator, :fields => [:first_name, :last_name]
#end
#
#class GoodnessValidator < ActiveModel::Validator
#  def validate(record)
#    if options[:fields].any? { |field| record.send(field) == "Evil" }
#      record.errors[:base] << "This person is evil"
#    end
#  end
#end




#OR this style
#
#class EmailValidator < ActiveModel::EachValidator
#  def validate_each(record, attribute, value)
#    unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
#      record.errors[attribute] << (options[:message] || "is not an email")
#    end
#  end
#end
#
#class Person < ActiveRecord::Base
#  validates :email, :presence => true, :email => true
#end




#this style cant be in this file:

#class Invoice < ActiveRecord::Base
#  validate :expiration_date_cannot_be_in_the_past,
#           :discount_cannot_be_greater_than_total_value
#
#  def expiration_date_cannot_be_in_the_past
#    if !expiration_date.blank? and expiration_date < Date.today
#      errors.add(:expiration_date, "can't be in the past")
#    end
#  end
#
#  def discount_cannot_be_greater_than_total_value
#    if discount > total_value
#      errors.add(:discount, "can't be greater than total value")
#    end
#  end
#end




#this style can go in this file

#ActiveRecord::Base.class_eval do
#  def self.validates_as_choice(attr_name, n, options={})
#    validates attr_name, :inclusion => {{:in => 1..n}.merge!(options)}
#  end
#end

#then this used on model:
#class Movie < ActiveRecord::Base
#  validates_as_choice :rating, 5
#end