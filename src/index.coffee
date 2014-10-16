dgram = require 'dgram'

class Client
  constructor : (options = {}) ->
    @_host = options.host || '127.0.0.1'
    @_port = options.port || '9300'
    @_category = options.category || ''
    @_udpClient = dgram.createSocket 'udp4'
    @timer = null
  ###*
   * [count 累加（在后台服务器会将特定时间间隔的值累加）]
   * @param  {[type]} key   [description]
   * @param  {[type]} value =             1 [description]
   * @return {[type]}       [description]
  ###
  count : (key, value = 1) ->
    @_send 'counter', key, value if @_validate key

  ###*
   * [average 平均值（在后台服务器会将特定时间间隔的值计算平均值）]
   * @param  {[type]} key   [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
  ###
  average : (key, value) ->
    @_send 'average', key, value if @_validate key

  ###*
   * [gauge 数值（在后台服务器会将特定时间间隔的值取最新值）]
   * @param  {[type]} key   [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
  ###
  gauge : (key, value) ->
    @_send 'gauge', key, value if @_validate key

  close : ->
    @_udpClient.close()


  _validate : (key) ->
    hasDivideFlag = !!~key.indexOf '|'
    if (@_category && hasDivideFlag) || (!@_category && !hasDivideFlag)
      console.error "It's not allow category:#{@_category} and key:#{key} both has '|'"
      false
    else
      true 

  _getData : (type, key, value) ->
    str = "#{key}|#{type}|#{value}|#{Date.now()}"
    str = "#{@_category}|#{str}" if @_category
    str

  _send : (type, key, value) ->
    str = @_getData type, key, value

    category = @_category
    port = @_port
    host = @_host
    client = @_udpClient
    buf = new Buffer str
    client.send buf, 0, buf.length, port, host
    @


module.exports = Client



# dgram = require 'dgram'
# server = dgram.createSocket 'udp4'
# server.on 'message', (msg) ->
#   console.dir msg.toString()
# server.bind '9300'

# client = new Client {
#   category : 'haproxy'
# }

# client.count 'httpRequest'
# client.average 'httpResTime', 300
# client.gauge 'httpReqeustTotal', 120

# client.count 'httpRequest'
# client.average 'httpResTime', 120
# client.gauge 'httpReqeustTotal', 60

# client.count 'httpRequest'
# client.average 'httpResTime', 340
# client.gauge 'httpReqeustTotal', 760

# client.count 'httpRequest'
# client.average 'httpResTime', 541
# client.gauge 'httpReqeustTotal', 320
