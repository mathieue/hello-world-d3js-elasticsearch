require 'rubygems'
require 'sinatra'
require 'rest_client'

ESHOST = '10.0.0.7:9200'

# home page
get '/' do
    File.read(File.join('public', 'index.html'))
end

get '/es/*' do |query|
  url =  "http://#{ESHOST}/#{query}?#{request.query_string}"
  logger.info "call on #{url} with params #{params.inspect}"
  RestClient.get url
end

post '/es/*' do |query|
  url =  "http://#{ESHOST}/#{query}"
  data = request.body.read
  logger.info "call on #{url} with data #{data}"
  RestClient.post url, data
end
