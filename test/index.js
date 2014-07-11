(function() {
  var Client, assert, client, clientFile, dgram, jsc, server;

  assert = require('assert');

  jsc = require('jscoverage');

  dgram = require('dgram');

  server = dgram.createSocket('udp4');

  clientFile = '../dest';

  if (process.env.NODE_ENV === 'cov') {
    Client = jsc.require(module, clientFile);
  } else {
    Client = require(clientFile);
  }

  client = new Client({
    host: '127.0.0.1',
    port: '9300',
    category: 'test',
    bufferSize: 0
  });

  server.bind('9300');

  describe('client', function() {
    describe('#count', function() {
      return it('should count successful', function(done) {
        server.once('message', function(msg) {
          if (!msg.toString().indexOf('test|count|counter|1|')) {
            return done();
          } else {
            return done(new Error('the count function\' data is wrong'));
          }
        });
        return client.count('count');
      });
    });
    describe('#average', function() {
      return it('should average successful', function(done) {
        server.once('message', function(msg) {
          if (!msg.toString().indexOf('test|average|average|1|')) {
            return done();
          } else {
            return done(new Error('the average function\' data is wrong'));
          }
        });
        return client.average('average', 1);
      });
    });
    describe('#gauge', function() {
      return it('should gauge successful', function(done) {
        server.once('message', function(msg) {
          if (!msg.toString().indexOf('test|gauge|gauge|1|')) {
            return done();
          } else {
            return done(new Error('the gauge function\' data is wrong'));
          }
        });
        return client.gauge('gauge', 1);
      });
    });
    return describe('#close', function() {
      return it('should close successful', function() {
        var e;
        client.close();
        try {
          return client.count('count');
        } catch (_error) {
          e = _error;
          return assert.equal('Not running', e.message);
        }
      });
    });
  });

}).call(this);
