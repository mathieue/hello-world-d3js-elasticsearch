require 'rubygems'
require 'sinatra'
require 'rest_client'

ESHOST = '10.0.0.7:9200'
PATH = '/artdb/work/_search?pretty=true'

# home page
get '/' do
    File.read(File.join('public', 'index.html'))
end

post '/search' do 
  url =  "http://#{ESHOST}#{PATH}"
  data = request.body.read
  logger.info "call on #{url} with data #{data}"
  RestClient.post url, data
end
