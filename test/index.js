"use strict";
var assert = require('assert');
var Client = require('../lib/client');
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
server.bind(9300);

describe('Client', function(){
  var client = new Client({
    category : 'test'
  });
  describe('#count', function(){
    it('should get count msg successful', function(done){
      server.once('message', function(msg){
        if(!msg.toString().indexOf('test|count|counter|1|')){
          done();
        }else{
          done(new Error('the count function\' data is wrong'));
        }
      });
      client.count('count');
    });
  });

  describe('#average', function(){
    it('should get average msg successful', function(done){
      server.once('message', function(msg){
        if(!msg.toString().indexOf('test|average|average|1|')){
          done();
        }else{
          done(new Error('the average function\' data is wrong'));
        }
      });
      client.average('average', 1);
    });
  });

  describe('#gauge', function(){
    it('should get gauge msg successful', function(done){
      server.once('message', function(msg){
        if(!msg.toString().indexOf('test|gauge|gauge|1|')){
          done();
        }else{
          done(new Error('the gauge function\' data is wrong'));
        }
      });
      client.gauge('gauge', 1);
    });
  });

  describe('#close', function(){
    it('should close successful', function(){
      client.close();
      server.close();
      try{
        client.count('count');
      }catch(e){
        assert.equal('Not running', e.message);
      }
    });
  })
});