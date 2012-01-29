require 'rubygems'
require 'sinatra'
require 'rest_client'

get '/es/*' do |query|
  url =  "http://10.0.0.7:9200/#{query}?#{request.query_string}"
  puts url
  puts params.inspect
  data = RestClient.get url
end

post '/es/*' do |query|
  url =  "http://10.0.0.7:9200/#{query}"
  puts url
  data = request.body.read
  puts data
  data = RestClient.post url, data
end

get '/' do
    File.read(File.join('public', 'index.html'))
end
