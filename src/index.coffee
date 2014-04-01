dgram = require 'dgram'

class Client
  constructor : (options = {}) ->
    @_host = options.host || '127.0.0.1'
    @_port = options.port || '9300'
    @_prefix = options.prefix || ''
    @_udpClient = dgram.createSocket 'udp4'

  counter : (tag, value = 1) ->
    @_send 'counter', tag, value

  average : (tag, value) ->
    @_send 'average', tag, value

  close : ->
    @_udpClient.close()

  _send : (type, tag, value) ->
    prefix = @_prefix
    port = @_port
    host = @_host
    client = @_udpClient
    tag = prefix + tag if prefix
    data =
      type : type
      tag : tag
      value : value
    buf = new Buffer JSON.stringify data
    client.send buf, 0, buf.length, port, host

module.exports = Client


# testClient = new Client {
#   port : '9200'
#   prefix : 'haproxy.'
# }

# for i in [0..10]
#   testClient.counter 'status.200', i