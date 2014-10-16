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
      this._category = options.category || '';
      this._udpClient = dgram.createSocket('udp4');
      this.timer = null;
    }


    /**
     * [count 累加（在后台服务器会将特定时间间隔的值累加）]
     * @param  {[type]} key   [description]
     * @param  {[type]} value =             1 [description]
     * @return {[type]}       [description]
     */

    Client.prototype.count = function(key, value) {
      if (value == null) {
        value = 1;
      }
      if (this._validate(key)) {
        return this._send('counter', key, value);
      }
    };


    /**
     * [average 平均值（在后台服务器会将特定时间间隔的值计算平均值）]
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */

    Client.prototype.average = function(key, value) {
      if (this._validate(key)) {
        return this._send('average', key, value);
      }
    };


    /**
     * [gauge 数值（在后台服务器会将特定时间间隔的值取最新值）]
     * @param  {[type]} key   [description]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */

    Client.prototype.gauge = function(key, value) {
      if (this._validate(key)) {
        return this._send('gauge', key, value);
      }
    };

    Client.prototype.close = function() {
      return this._udpClient.close();
    };

    Client.prototype._validate = function(key) {
      var hasDivideFlag;
      hasDivideFlag = !!~key.indexOf('|');
      if ((this._category && hasDivideFlag) || (!this._category && !hasDivideFlag)) {
        console.error("It's not allow category:" + this._category + " and key:" + key + " both has '|'");
        return false;
      } else {
        return true;
      }
    };

    Client.prototype._getData = function(type, key, value) {
      var str;
      str = "" + key + "|" + type + "|" + value + "|" + (Date.now());
      if (this._category) {
        str = "" + this._category + "|" + str;
      }
      return str;
    };

    Client.prototype._send = function(type, key, value) {
      var buf, category, client, host, port, str;
      str = this._getData(type, key, value);
      category = this._category;
      port = this._port;
      host = this._host;
      client = this._udpClient;
      buf = new Buffer(str);
      client.send(buf, 0, buf.length, port, host);
      return this;
    };

    return Client;

  })();

  module.exports = Client;

}).call(this);
