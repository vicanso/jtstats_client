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

    Client.prototype.counter = function(tag, value) {
      if (value == null) {
        value = 1;
      }
      return this._send('counter', tag, value);
    };

    Client.prototype.average = function(tag, value) {
      return this._send('average', tag, value);
    };

    Client.prototype.close = function() {
      return this._udpClient.close();
    };

    Client.prototype._send = function(type, tag, value) {
      var buf, client, data, host, port, prefix;
      prefix = this._prefix;
      port = this._port;
      host = this._host;
      client = this._udpClient;
      if (prefix) {
        tag = prefix + tag;
      }
      data = {
        type: type,
        tag: tag,
        value: value
      };
      buf = new Buffer(JSON.stringify(data));
      return client.send(buf, 0, buf.length, port, host);
    };

    return Client;

  })();

  module.exports = Client;

}).call(this);
