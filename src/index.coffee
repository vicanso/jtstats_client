dgram = require 'dgram'

class Client
  constructor : (options = {}) ->
    @_host = options.host || '127.0.0.1'
    @_port = options.port || '9300'
    @_prefix = options.prefix || ''
    @_udpClient = dgram.createSocket 'udp4'

  counter : (key, value = 1) ->
    @_send 'counter', key, value

  average : (key, value) ->
    @_send 'average', key, value

  close : ->
    @_udpClient.close()

  _send : (type, key, value) ->
    prefix = @_prefix
    port = @_port
    host = @_host
    client = @_udpClient
    key = prefix + key if prefix
    data =
      type : type
      key : key
      value : value
    buf = new Buffer JSON.stringify data
    client.send buf, 0, buf.length, port, host

module.exports = Client


# testClient = new Client {
#   port : '9300'
#   prefix : 'haproxy.'
# }

# setInterval ->
#   time = Math.floor Math.random() * 1000 + 300
#   testClient.average 'http.resTime', time

#   random = Math.random()
#   if random < 0.7
#     testClient.counter 'statusCode.200'
#   else if random < 0.9
#     testClient.counter 'statusCode.500'
#   else
#     testClient.counter 'statusCode.404'
# , 1000
