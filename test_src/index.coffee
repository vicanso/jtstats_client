assert = require 'assert'
jsc = require 'jscoverage'
dgram = require 'dgram'
server = dgram.createSocket 'udp4'

clientFile = '../dest'

if process.env.NODE_ENV == 'cov'
  Client = jsc.require module, clientFile
else
  Client = require clientFile

client = new Client {
  host : '127.0.0.1'
  port : '9300'
  category : 'test'
  bufferSize : 0
}

server.bind '9300'

describe 'client', ->
  describe '#count', ->
    it 'should count successful', (done) ->
      server.once 'message', (msg)->
        if !msg.toString().indexOf 'test|count|counter|1|'
          done()
        else
          done new Error 'the count function\' data is wrong'
      client.count 'count'
  describe '#average', ->
    it 'should average successful', (done) ->
      server.once 'message', (msg)->
        if !msg.toString().indexOf 'test|average|average|1|' 
          done()
        else
          done new Error 'the average function\' data is wrong'
      client.average 'average', 1
  describe '#gauge', ->
    it 'should gauge successful', (done) ->
      server.once 'message', (msg)->
        if !msg.toString().indexOf 'test|gauge|gauge|1|'
          done()
        else
          done new Error 'the gauge function\' data is wrong'
      client.gauge 'gauge', 1

  describe '#close', ->
    it 'should close successful', ->
      client.close()
      try
        client.count 'count'
      catch e
        assert.equal 'Not running', e.message
      
      