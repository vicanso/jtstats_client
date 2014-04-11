dgram = require 'dgram'

class Client
  constructor : (options = {}) ->
    @_host = options.host || '127.0.0.1'
    @_port = options.port || '9300'
    @_prefix = options.prefix || ''
    @_udpClient = dgram.createSocket 'udp4'
  ###*
   * [count 累加（将特定时间间隔内发送到统计后台的值累加）]
   * @param  {[type]} key   [description]
   * @param  {[type]} value =             1 [description]
   * @return {[type]}       [description]
  ###
  count : (key, value = 1) ->
    @_send 'counter', key, value

  ###*
   * [average 平均值（将特定时间间隔内发送到统计后台的值计算平均值）]
   * @param  {[type]} key   [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
  ###
  average : (key, value) ->
    @_send 'average', key, value

  ###*
   * [gauge 数值（将特定时间间隔内发送到统计后台的值取最新值）]
   * @param  {[type]} key   [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
  ###
  gauge : (key, value) ->
    @_send 'gauge', key, value

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

