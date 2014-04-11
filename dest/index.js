(function() {
  var Client, dgram;

  dgram = require('dgram');

  Client = (function() {
    function Client(options) {
      if (options == null) {
        options = {};
      }
      this._host = options.host || '127.0.0.1';
      this._port = options.port || '9300';
      this._prefix = options.prefix || '';
      this._udpClient = dgram.createSocket('udp4');
    }


    /**
     * [count 累加（将特定时间间隔内发送到统计后台的值累加）]
     * @param  {[type]} key   [description]
     * @param  {[type]} value =             1 [description]
     * @return {[type]}       [description]
     */

    Client.prototype.count = function(key, value) {
      if (value == null) {
        value = 1;
      }
      return this._send('counter', key, value);
    };


    /**
     * [average 平均值（将特定时间间隔内发送到统计后台的值计算平均值）]
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */

    Client.prototype.average = function(key, value) {
      return this._send('average', key, value);
    };


    /**
     * [gauge 数值（将特定时间间隔内发送到统计后台的值取最新值）]
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */

    Client.prototype.gauge = function(key, value) {
      return this._send('gauge', key, value);
    };

    Client.prototype.close = function() {
      return this._udpClient.close();
    };

    Client.prototype._send = function(type, key, value) {
      var buf, client, data, host, port, prefix;
      prefix = this._prefix;
      port = this._port;
      host = this._host;
      client = this._udpClient;
      if (prefix) {
        key = prefix + key;
      }
      data = {
        type: type,
        key: key,
        value: value
      };
      buf = new Buffer(JSON.stringify(data));
      return client.send(buf, 0, buf.length, port, host);
    };

    return Client;

  })();

  module.exports = Client;

}).call(this);
