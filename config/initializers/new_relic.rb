#this is only needed if puma is used but it didn't work for me
#if defined?(NewRelic) && defined?(Puma)
#  NewRelic::Agent.after_fork force_reconnect: true
#end