'use strict';

var dgram = require('dgram');
var util = require('util');

function Client(options){
  options = options || {};
  this._host = options.host || '127.0.0.1';
  this._port = options.port || 9300;
  this._category = options.category || '';
  this._udpClient = dgram.createSocket('udp4');
}

var fn = Client.prototype;

/**
 * [count 累加（在后台服务器会将特定时间间隔的值累加）]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
fn.count = function(key, value){
  value = value || 1;
  if(this._validate(key)){
    this._send('counter', key, value);
  }
  return this;
};

/**
 * [average 平均值（在后台服务器会将特定时间间隔的值计算平均值）]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
fn.average = function(key, value){
  if(this._validate(key)){
    this._send('average', key, value);
  }
  return this;
};

/**
 * [gauge 数值（在后台服务器会将特定时间间隔的值取最新值）]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
fn.gauge = function(key, value){
  if(this._validate(key)){
    this._send('gauge', key, value);
  }
  return this;
};

/**
 * [close 关闭udp连接]
 * @return {[type]} [description]
 */
fn.close = function(){
  this._udpClient.close();
};

/**
 * [_validate 校验key是否合法]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
fn._validate = function(key){
  if(!key){
    return false;
  }
  var hasDivideFlag = !!~key.indexOf('|');
  if((this._category && hasDivideFlag) || (!this._category && !hasDivideFlag)){
    console.error(util.format("It's not allow category:%s and key:%s both has '|'"), this._category, key);
    return false;
  }else{
    return true;
  }
};

/**
 * [_format description]
 * @param  {[type]} type  [description]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
fn._format = function(type, key, value){
  var str = util.format('%s|%s|%d|%d', key, type, value, Date.now());
  if(this._category){
    str = this._category + '|' + str;
  }
  return str;
};

/**
 * [_send 发送数据]
 * @param  {[type]} type  [description]
 * @param  {[type]} key   [description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
fn._send = function(type, key, value){
  if(!value){
    return this;
  }
  var str = this._format(type, key, value);
  var client = this._udpClient;
  var buf = new Buffer(str);
  client.send(buf, 0, buf.length, this._port, this._host);
  return this;
};

module.exports = Client;